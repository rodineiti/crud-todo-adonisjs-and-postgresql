"use strict";

const { validate } = use("Validator");
const Task = use("App/Models/Task");

class TaskController {
  async index({ view }) {
    const tasks = await Task.all();

    return view.render("tasks", {
      tasks: tasks.toJSON()
    });
  }

  async store({ request, response, session }) {
    const task = new Task();

    const messages = {
      "title.required": "Title is required",
      "body.required": "Body is required"
    };

    const rules = {
      title: "required",
      body: "required"
    };

    const validation = await validate(request.all(), rules, messages);

    if (validation.fails()) {
      session.withErrors(validation.messages());
      return response.redirect("back");
    }

    task.title = request.input("title");
    task.body = request.input("body");
    await task.save();

    session.flash({ notification: "Task saveded" });

    return response.redirect("/tasks");
  }

  async show({ params, view }) {
    const task = await Task.find(params.id);

    return view.render("detail", {
      task: task
    });
  }

  async destroy({ params, view, response, session }) {
    const task = await Task.find(params.id);
    task.delete();

    session.flash({ notification: "Task deleted" });

    return response.redirect("/tasks");
  }

  async edit({ params, view }) {
    const task = await Task.find(params.id);

    return view.render("edit", {
      task: task
    });
  }

  async update({ params, request, response, session }) {
    const task = await Task.find(params.id);

    const messages = {
      "title.required": "Title is required",
      "body.required": "Body is required"
    };

    const rules = {
      title: "required",
      body: "required"
    };

    const validation = await validate(request.all(), rules, messages);

    if (validation.fails()) {
      session.withErrors(validation.messages());
      return response.redirect("back");
    }

    task.title = request.input("title");
    task.body = request.input("body");
    await task.save();

    session.flash({ notification: "Task updated" });

    return response.redirect("/tasks");
  }
}

module.exports = TaskController;
