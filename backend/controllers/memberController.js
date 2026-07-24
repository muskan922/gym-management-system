import Member from '../models/Member.js';
import MembershipPlan from '../models/MembershipPlan.js';
import Trainer from '../models/Trainer.js';

export const getMembers = async (req, res, next) => {
  try {
    const {
      search,
      status,
      planId,
      trainerId,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (status) query.status = status;
    if (planId) query.planId = planId;
    if (trainerId) query.trainerId = trainerId;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

   const [total, members] = await Promise.all([
  Member.countDocuments(query),
  Member.find(query)
    .populate({ path: "planId", select: "name price" })
    .populate({ path: "trainerId", select: "name" })
    .sort({ [sortBy]: order === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limitNum),
]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      members,
    });
  } catch (error) {
    next(error);
  }
};

export const getMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id)
      .populate({ path: 'planId', select: 'name price durationMonths description' })
      .populate({ path: 'trainerId' })
      .populate({
        path: 'attendance',
      })
      .populate({
        path: 'payments',
      });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Fallback: since our schema doesn't define attendance/payments virtuals,
    // we keep the response behavior minimal by only returning the member.
    res.status(200).json({ success: true, member });
  } catch (error) {
    next(error);
  }
};

export const createMember = async (req, res, next) => {
  try {
    const { name, email, phone, planId, trainerId, membershipStart, status } = req.body;

    if (!name || !email || !phone || !planId || !membershipStart) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, phone, plan, and start date' });
    }

    const memberExists = await Member.findOne({ email });
    if (memberExists) {
      return res.status(400).json({ success: false, message: 'Member with this email already exists' });
    }

    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Membership plan not found' });
    }

    const start = new Date(membershipStart);
    const end = new Date(start);
    end.setMonth(end.getMonth() + plan.durationMonths);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkEnd = new Date(end);
    checkEnd.setHours(0, 0, 0, 0);

    let finalStatus = status || 'ACTIVE';
    if (checkEnd < today) finalStatus = 'EXPIRED';

    const member = await Member.create({
      name,
      email,
      phone,
      status: finalStatus,
      membershipStart: start,
      membershipEnd: end,
      planId,
      trainerId: trainerId || null,
    });

    const populated = await Member.findById(member._id)
      .populate({ path: 'planId', select: 'name price' })
      .populate({ path: 'trainerId', select: 'name' });

    res.status(201).json({ success: true, member: populated });
  } catch (error) {
    next(error);
  }
};

export const updateMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, planId, trainerId, membershipStart, status } = req.body;

    const memberExists = await Member.findById(id);
    if (!memberExists) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    if (email && email !== memberExists.email) {
      const emailTaken = await Member.findOne({ email });
      if (emailTaken && emailTaken._id.toString() !== id) {
        return res.status(400).json({ success: false, message: 'Email already taken by another member' });
      }
    }

    let start = memberExists.membershipStart;
    let end = memberExists.membershipEnd;

    if (membershipStart) {
      start = new Date(membershipStart);
    }

    if (planId && planId.toString() !== memberExists.planId?.toString()) {
      const plan = await MembershipPlan.findById(planId);
      if (plan) {
        end = new Date(start);
        end.setMonth(end.getMonth() + plan.durationMonths);
      }
    } else if (membershipStart) {
      const plan = await MembershipPlan.findById(memberExists.planId);
      if (plan) {
        end = new Date(start);
        end.setMonth(end.getMonth() + plan.durationMonths);
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkEnd = new Date(end);
    checkEnd.setHours(0, 0, 0, 0);

    let finalStatus = status || memberExists.status;
    if (checkEnd < today) finalStatus = 'EXPIRED';
    else if (status === 'EXPIRED' && checkEnd >= today) finalStatus = 'ACTIVE';

    memberExists.name = name ?? memberExists.name;
    memberExists.email = email ?? memberExists.email;
    memberExists.phone = phone ?? memberExists.phone;
    memberExists.status = finalStatus;
    memberExists.membershipStart = start;
    memberExists.membershipEnd = end;
    memberExists.planId = planId ?? memberExists.planId;
    memberExists.trainerId = trainerId === '' ? null : trainerId ?? memberExists.trainerId;

    await memberExists.save();

    const populated = await Member.findById(memberExists._id)
      .populate({ path: 'planId', select: 'name price' })
      .populate({ path: 'trainerId', select: 'name' });

    res.status(200).json({ success: true, member: populated });
  } catch (error) {
    next(error);
  }
};

export const deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const memberExists = await Member.findById(id);
    if (!memberExists) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    await Member.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    next(error);
  }
};

