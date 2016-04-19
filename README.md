# WunderSchedule
  [![Build Status](https://travis-ci.org/benjamincongdon/WunderSchedule.svg?branch=master)](https://travis-ci.org/benjamincongdon/WunderSchedule)
  [![npm version](https://badge.fury.io/js/wunderschedule.svg)](https://badge.fury.io/js/wunderschedule)
  >A Node.js module that allows you to 'schedule' tasks to appear in your Wunderlist todos

## Installation
1. Install with `npm install -g wunderschedule`.
2. Go to the [Wunderlist Developer Portal](https://developer.wunderlist.com/apps) and register an app. Take note of your `Client ID`. Click `Create Access Token` and record the resulting token.
3. Run `wunderschedule auth` and paste in your `Client ID` and `Access Token`.

## Usage
1. Run `wunderschedule` once in the command line and do `Ctrl-C` to kill it. This will create a list called `scheduled` in your Wunderlist account. (Alternatively, just created a list entitled `scheduled`)
2. Add tasks in the `scheduled` lists to schedule todos. Wunderschedule uses special tags that you enter into the 'note' section of the tasks to allow you to schedule upcoming todos. The task's title will be maintained as the title of the resulting todo. 
3. Run `wunderschedule` and let it continue running in the background. Every minute, it will check the `scheduled` list and create tasks defined by the template tasks if necessary.

### Example
Suppose I want to remind myself every Friday afternoon to take out the trash.
  1. Create a task called `Take out the Trash` in the `scheduled` list.
  2. In the 'Note' section of the task, enter:

      ```
      due-date: Friday
      start-time: 4pm
      repeat-every: Friday
      ```
  3. When I leave `wunderschedule` running, on Friday I will receive a todo in my inbox at 4pm with the title `Take out the Trash`. Furthermore, this task will be created by `wunderschedule` every Friday.

**Note:** Do not put any data in the Wunderlist 'Due Date' or 'Remind Me' fields in template tasks. While this will not disrupt the functionality of Wunderschedule, it is unnecessary and defeats the purpose of Wunderschedule.

## Tags
`start-time:` - Defines the time (on due date) at which the scheduled task will appear in your todo. 

`list:` - [Optional] The name of the list you want the task to appear in. Defaults to `inbox`. 

`starred` - [Optional] Whether or not the resulting task should be starred (No parameter needed; the pressense of `starred` by itself will make the task starred)

`due-date:` - Due date of the task. Sets both the due date in the resulting todo, and gates the day when the todo is created.

`repeat-every` - [Optional] Defines when the task should be repeated. 
  * Example inputs: Multiple days of week can be specified space-separated (i.e. `Monday Wednesday Friday` is valid). `day`, `week`, `month`, `year`, are valid as are scaled versions of these (i.e. `3 days`)

**Note:** All times / dates are parsed with [DateJS](http://www.datejs.com/), which has a handy validator on their homepage. If your input parses with that test, then it should work in Wunderschedule.

## Attribution
* Thanks to [Wunderline](https://github.com/we-are-next/wunderline/blob/master/wunderline.js) for their well documented code. A lot of the implimentation of Wunderschedule was inspired by Wunderline.
