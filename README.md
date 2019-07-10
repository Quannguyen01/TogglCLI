[![Build Status](https://dev.azure.com/quannguyenhongdev/quannguyenhongdev/_apis/build/status/Quannguyen01.TogglCLI?branchName=master)](https://dev.azure.com/quannguyenhongdev/quannguyenhongdev/_build/latest?definitionId=1&branchName=master)

Pre Setup:

`npm install`

Setup the environemnt:

* The program will always stored your config in `config.yml` file in the same folder as the source
* To change/set API KEY, do `auth_token <API_KEY>`
* To set active workspace do `workspace <workspace_name>`

Usage:

| Description | Command |
| ----------- | ------- |
| Start a task/time-entry | `start -p <project> <task>` |
| Stop current task | `stop` |
| View current task | `current` |
| Swap workspace | `workspace <workspace_name>` |
| List available workspaces | `workspace` |
| List today's entries | `entries` |
| Delete an entry | `delete <timeEntryId>` |
| Find projects available in current workspace | `projects` |
| For more info | `--help` |