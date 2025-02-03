# doctor app

## turso

rodar a migrate dev para criar o sql
```bash
pnpm db:migrate:dev
```

jogar alterações ao banco de dados do turso
tem que ter o turso instalado e autenticado
```bash
turso db shell <database-name> < ./prisma/migrations/{nome_da_migration}/migration.sql
```

rodar os seeds
```bash
pnpm db:seed
pnpm db:seed:cid
```

### backup do banco de dados
- periodicamente no próprio turso
- macos - raycast "today in iso". Ex: 2025-01-29T12:00:00-03:00
```bash
turso db create <database-name>-backup{timestamp} --from-db <database-name> --timestamp {timestamp}
```

- database dump
```bash
turso db shell <database-name> .dump > dump.sql
```

- load database dump
```bash
turso db shell <database-name> < dump.sql
```
