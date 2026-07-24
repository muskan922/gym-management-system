import GymSettings from '../models/GymSettings.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await GymSettings.findById('default');

    if (!settings) {
      settings = await GymSettings.create({
        _id: 'default',
        gymName: 'Powerhouse Gym',
        gymAddress: '123 Fitness Street, Gym City',
        phone: '+1234567890',
        email: 'info@powerhousegym.com',
        currency: 'USD',
      });
    }

    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { gymName, gymAddress, phone, email, currency } = req.body;

    const settings = await GymSettings.findByIdAndUpdate(
      'default',
      {
        gymName,
        gymAddress,
        phone,
        email,
        currency,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

