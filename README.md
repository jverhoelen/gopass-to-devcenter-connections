## Gopass secrets to DevCenter connections

Tired of maintaining your dozens of Cassandra connections in DevCenter manually although you maintain your connection details in gopass already? Try this out.

### Usage

It's very simple until now and not intended to match every use case, yet. At the moment there are several (partly configurable) assumptions made by the tool:

1. The first segment of the relevant secret names is something like your store name, e.g. `company/...`
2. The second segment is the prefix, `cassandra` by default and configurable by `-p` or `--prefix`
3. The third segment is the environment of a Cassandra, `dev`, `pp` or `prod` by default and configurable with `-e` or `--environments`
4. The fourth segment is some purpose of that Cassandra or the connection, e.g. `my-app`
5. The sixth segment is one of the concrete connection details; `username`, `password` and `nodes` by default and configurable with `-d` or `--details`

A full custom example:

``` bash
node StartProgram.js --prefix cassandra --environments develop,pre-prod,production --details username,password,nodez
```

### Contribution

I'm open to any kind of contribution, feel free to open issues and pull requests as you have some ideas.
