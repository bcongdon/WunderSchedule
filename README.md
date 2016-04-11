# WunderSchedule
  [![Build Status](https://travis-ci.org/benjamincongdon/WunderSchedule.svg?branch=master)](https://travis-ci.org/benjamincongdon/WunderSchedule)
  >A Node.js module that allows you to 'schedule' tasks to appear in your Wunderlist todos

## Installation
1. Install with `npm install -g wunderschedule`.
2. Go to the [Wunderlist Developer Portal](https://developer.wunderlist.com/apps) and register an app. Take note of your `Client ID`. Click `Create Access Token` and record the resulting token.
3. Run `wunderschedule auth` and paste in your `Client ID` and `Access Token`.

## Usage
  > TODO

## Tags
`start-time:` - Defines the time (on due date) at which the scheduled task will appear in your todo

`list:` - The name of the list you want the task to appear in. Defaults to `inbox`.

`starred` - Whether or not the resulting task should be starred

`due-date:` - Day when the task will be done

### Tags-to-be-done
`repeat-every` - TODO

## Attribution
* Thanks to [Wunderline](https://github.com/we-are-next/wunderline/blob/master/wunderline.js) for their well documented code. A lot of the implimentation of Wunderschedule was inspired by Wunderline.
