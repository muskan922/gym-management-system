import Payment from '../models/Payment.js';
import Member from '../models/Member.js';

export const getPayments = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const memberIds = search
      ? (
          await Member.find({
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } },
            ],
          }).select('_id')
        ).map((m) => m._id)
      : null;

    const query = {};
    if (status) query.status = status;
    if (memberIds) query.memberId = { $in: memberIds };

    const total = await Payment.countDocuments(query);

    const payments = await Payment.find(query)
      .populate({ path: 'memberId', select: 'name email phone' })
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(limitNum);

    // match Prisma include.member -> member (object)
    const mapped = payments.map((p) => ({
      ...p.toObject(),
      member: p.memberId,
      memberId: undefined,
    }));

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      payments: mapped,
    });
  } catch (error) {
    next(error);
  }
};

export const recordPayment = async (req, res, next) => {
  try {
    const { memberId, amount, paymentDate, paymentMethod, status, notes } = req.body;

    if (!memberId || amount === undefined || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Please provide memberId, amount, and paymentMethod' });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const payment = await Payment.create({
      memberId,
      amount: parseFloat(amount),
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      paymentMethod,
      status: status || 'PAID',
      notes,
    });

    const populated = await Payment.findById(payment._id)
      .populate({ path: 'memberId', select: 'name' })
      .lean();

    res.status(201).json({
      success: true,
      payment: {
        ...populated,
        member: populated.memberId,
        memberId: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id).populate({
      path: 'memberId',
      select: 'name email phone status',
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    const obj = payment.toObject();

    res.status(200).json({
      success: true,
      payment: {
        ...obj,
        member: obj.memberId,
        memberId: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    await Payment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Payment record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

