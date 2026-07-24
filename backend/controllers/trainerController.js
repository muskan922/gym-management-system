import Trainer from '../models/Trainer.js';

export const getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      trainers,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrainerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trainer = await Trainer.findById(id);

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    res.status(200).json({
      success: true,
      trainer,
    });
  } catch (error) {
    next(error);
  }
};

export const createTrainer = async (req, res, next) => {
  try {
    const { name, email, phone, specialty, salary } = req.body;

    if (!name || !email || !phone || !specialty || salary === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const trainerExists = await Trainer.findOne({ email });
    if (trainerExists) {
      return res.status(400).json({ success: false, message: 'Trainer with this email already exists' });
    }

    const trainer = await Trainer.create({
      name,
      email,
      phone,
      specialty,
      salary: parseFloat(salary),
    });

    res.status(201).json({
      success: true,
      trainer,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTrainer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, specialty, salary } = req.body;

    const trainer = await Trainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    if (email && email !== trainer.email) {
      const emailTaken = await Trainer.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({ success: false, message: 'Email already taken by another trainer' });
      }
    }

    trainer.name = name ?? trainer.name;
    trainer.email = email ?? trainer.email;
    trainer.phone = phone ?? trainer.phone;
    trainer.specialty = specialty ?? trainer.specialty;
    trainer.salary = salary !== undefined ? parseFloat(salary) : trainer.salary;

    await trainer.save();

    res.status(200).json({
      success: true,
      trainer,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTrainer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trainer = await Trainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    await Trainer.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Trainer deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
