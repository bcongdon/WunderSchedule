# WunderSchedule
A Node.js module that allows you to 'schedule' tasks to appear in your Wunderlist todos

## Usage
This module is not yet in a state that it would be useful to anyone.
However, if you do want to tinker around with it, you must go to the [Wunderlist Developer Portal](https://developer.wunderlist.com/apps) and register an app.
Then, copy `credentials_template.json` to `credentials.json` in `utils` and add your `client_id` and `access_token` which you've created.

Then, just run `node wunderschedule.js` and something ~~will~~ might happen!

## Tags
`start-time:` - Defines the time (on due date) at which the scheduled task will appear in your todo

`list:` - The name of the list you want the task to appear in. Defaults to `inbox`.

`starred` - Whether or not the resulting task should be starred

`due-date:` - Day when the task will be done

### Tags-to-be-done
`repeat-every` - TODO
