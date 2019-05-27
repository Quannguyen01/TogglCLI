Pre Setup:

`npm install`

Setup the environemnt:

* The program will always stored your config in `config.yml` file in the same folder as the source
* To change/set API KEY, do `auth_token <API_KEY>`
* To set active workspace do `workspace <workspace_name>`

To use:

* Start a task/time-entry: `start -p <project> <task>`
* Stop current task: `stop`
* View current task: `current`
* Swap workspace: `workspace <workspace_name>`
* List available workspaces: `workspace`
* List today's entries: `entries`
* Delete an entry: `delete <timeEntryId>`
* For more info `--help`