import Task from "../models/task.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    const task = await Task.create({
      userId: req.userId,  
      title,
      description,
      dueDate,
      priority,
      status,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { q, status, priority, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.userId };  

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (q)
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];

    const skip = (Math.max(1, page) - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    res.json({ tasks, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    console.log("Req params ID:", req.params.id);
    console.log("User ID from token:", req.userId);
    const task = await Task.findById(req.params.id);

    if (!task || task.userId.toString() !== req.userId.toString()) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.userId.toString() !== req.userId.toString()) 
      return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.userId.toString() !== req.userId.toString()) 
      return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();

    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};
