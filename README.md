Pre Setup:

`npm install`

Setup the environemnt:

* The program will always stored your config in `config.yml` file in the same folder as the source
* To change/set API KEY, do `auth_token <API_KEY>`
* To set active workspace do `workspace <workspace_id>`

To use:

* Start a task/time-entry `start -p <project> <task>`
* Stop current task `stop`
* View current task `current`
* Swap workspace `workspace <workspace_id>`
* List available workspaces `workspace`
* For more info `--help`