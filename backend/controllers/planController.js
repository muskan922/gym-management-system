import MembershipPlan from '../models/MembershipPlan.js';
import Member from '../models/Member.js';

export const getPlans = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find({}).sort({ createdAt: -1 });

    // Attach counts similar to Prisma _count.members
    const plansWithCount = await Promise.all(
      plans.map(async (p) => {
        const count = await Member.countDocuments({ planId: p._id });
        return { ...p.toObject(), _count: { members: count } };
      })
    );

    res.status(200).json({ success: true, plans: plansWithCount });
  } catch (error) {
    next(error);
  }
};

export const getPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plan = await MembershipPlan.findById(id);

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.status(200).json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const { name, durationMonths, price, description } = req.body;

    if (!name || durationMonths === undefined || price === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide name, duration, and price' });
    }

    const plan = await MembershipPlan.create({
      name,
      durationMonths: parseInt(durationMonths, 10),
      price: parseFloat(price),
      description,
    });

    res.status(201).json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, durationMonths, price, description } = req.body;

    const planExists = await MembershipPlan.findById(id);

    if (!planExists) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    if (name !== undefined) planExists.name = name;
    if (durationMonths !== undefined) planExists.durationMonths = parseInt(durationMonths, 10);
    if (price !== undefined) planExists.price = parseFloat(price);
    if (description !== undefined) planExists.description = description;

    await planExists.save();

    res.status(200).json({ success: true, plan: planExists });
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const planExists = await MembershipPlan.findById(id);
    if (!planExists) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const membersCount = await Member.countDocuments({ planId: id });
    if (membersCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete plan. There are ${membersCount} members assigned to this plan.`,
      });
    }

    await MembershipPlan.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};

