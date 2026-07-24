import Attendance from '../models/Attendance.js';
import Member from '../models/Member.js';

const normalizeToMidnight = (d) => {
  const dt = new Date(d);
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
};

export const getAttendanceByDate = async (req, res, next) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    const queryDate = date ? new Date(date) : new Date();

    const startOfDay = normalizeToMidnight(queryDate);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const members = await Member.find({ status: 'ACTIVE' }).sort({ name: 1 }).select('name email phone');

    // Pull attendance logs for the day for active members
    const memberIds = members.map((m) => m._id);
    const logs = await Attendance.find({ memberId: { $in: memberIds }, date: { $gte: startOfDay, $lte: endOfDay } })
      .select('memberId status date');

    const logByMember = new Map(logs.map((l) => [l.memberId.toString(), l]));

    const list = members.map((m) => {
      const log = logByMember.get(m._id.toString());
      return {
        memberId: m._id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        attendanceStatus: log?.status || null,
        attendanceId: log?._id || null,
      };
    });

    res.status(200).json({ success: true, date: startOfDay, attendance: list });
  } catch (error) {
    next(error);
  }
};

export const markAttendance = async (req, res, next) => {
  try {
    const { memberId, date, status } = req.body;

    if (!memberId || !status) {
      return res.status(400).json({ success: false, message: 'Please provide memberId and status' });
    }

    const queryDate = date ? new Date(date) : new Date();
    const startOfDay = normalizeToMidnight(queryDate);

    const attendance = await Attendance.findOneAndUpdate(
      { memberId, date: startOfDay },
      { $set: { status } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, attendance });
  } catch (error) {
    next(error);
  }
};

export const getMemberAttendanceHistory = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const history = await Attendance.find({ memberId }).sort({ date: -1 });
    res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

export const getAttendanceStats = async (req, res, next) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const logs = await Attendance.find({
      date: { $gte: thirtyDaysAgo, $lte: today },
    }).select('status');

    const presentCount = logs.filter((l) => l.status === 'PRESENT').length;
    const absentCount = logs.filter((l) => l.status === 'ABSENT').length;

    res.status(200).json({
      success: true,
      present: presentCount,
      absent: absentCount,
      total: logs.length,
    });
  } catch (error) {
    next(error);
  }
};

