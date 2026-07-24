import Member from '../models/Member.js';
import Trainer from '../models/Trainer.js';
import Payment from '../models/Payment.js';
import Attendance from '../models/Attendance.js';
import MembershipPlan from '../models/MembershipPlan.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();

    // 1. Core counters
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'ACTIVE' });
    const totalTrainers = await Trainer.countDocuments();

    // 2. Monthly Revenue calculation
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const revenueDocs = await Payment.find({
      status: 'PAID',
      paymentDate: { $gte: startOfMonth, $lte: endOfMonth },
    }).select('amount');

    const monthlyRevenue = revenueDocs.reduce((sum, d) => sum + (d.amount || 0), 0);

    // 3. Expiry in next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const expiringSoon = await Member.countDocuments({
      status: 'ACTIVE',
      membershipEnd: { $gte: today, $lte: thirtyDaysFromNow },
    });

    // 4. Recent activities
    const recentMembers = await Member.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: 'planId', select: 'name' });

    const recentPayments = await Payment.find({})
      .sort({ paymentDate: -1 })
      .limit(5)
      .populate({ path: 'memberId', select: 'name' });

    const activities = [
      ...recentMembers.map((m) => ({
        type: 'REGISTRATION',
        title: 'New Member Registered',
        description: `${m.name} registered for ${m.planId?.name || ''}`,
        date: m.createdAt,
      })),
      ...recentPayments.map((p) => ({
        type: 'PAYMENT',
        title: 'Payment Received',
        description: `Collected $${(p.amount || 0).toFixed(2)} from ${p.memberId?.name || ''}`,
        date: p.paymentDate,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // 5. Chart Data: Monthly Revenue (Last 6 Months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const paymentsLastSixMonths = await Payment.find({
      status: 'PAID',
      paymentDate: { $gte: (() => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);
        return sixMonthsAgo;
      })(), $lte: today },
    }).select('amount paymentDate');

    const revenueChart = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(today.getMonth() - i);
      const mLabel = months[d.getMonth()] + ' ' + d.getFullYear().toString().slice(-2);

      const totalForMonth = paymentsLastSixMonths
        .filter((p) => {
          const pDate = new Date(p.paymentDate);
          return pDate.getMonth() === d.getMonth() && pDate.getFullYear() === d.getFullYear();
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      revenueChart.push({ month: mLabel, revenue: parseFloat(totalForMonth.toFixed(2)) });
    }

    // 6. Plan distribution (active members per plan)
    const plans = await MembershipPlan.find({});
    const planDistribution = await Promise.all(
      plans.map(async (p) => {
        const value = await Member.countDocuments({ planId: p._id, status: 'ACTIVE' });
        return { name: p.name, value };
      })
    );

    // 7. Attendance stats (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const attendanceLogs = await Attendance.find({
      date: { $gte: sevenDaysAgo, $lte: today },
    }).select('status date');

    const attendanceChart = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

      const presentCount = attendanceLogs.filter((a) => {
        const aDate = new Date(a.date);
        return (
          aDate.getDate() === d.getDate() &&
          aDate.getMonth() === d.getMonth() &&
          aDate.getFullYear() === d.getFullYear() &&
          a.status === 'PRESENT'
        );
      }).length;

      const absentCount = attendanceLogs.filter((a) => {
        const aDate = new Date(a.date);
        return (
          aDate.getDate() === d.getDate() &&
          aDate.getMonth() === d.getMonth() &&
          aDate.getFullYear() === d.getFullYear() &&
          a.status === 'ABSENT'
        );
      }).length;

      attendanceChart.push({ day: dayLabel, present: presentCount, absent: absentCount });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalMembers,
        activeMembers,
        totalTrainers,
        monthlyRevenue,
        expiringSoon,
      },
      activities,
      revenueChart,
      planDistribution,
      attendanceChart,
    });
  } catch (error) {
    next(error);
  }
};

