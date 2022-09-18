## Подготовка к работе

* Установить GIT
* NodeJS 16
* PostgreSQL 13

## Подготовка бд

* Проинициализировать кластер

```
initdb --locale=ru_RU.UTF-8 --encoding=UTF8 -D /путь_где_будут_расположены_файлы_бд
```

* Поправить postgresql.conf
```
listen_addresses='*'
datestyle='iso, dmy'
nf.org = -1
```

* Создать роли

```
psql -c "CREATE ROLE nfadm NOINHERIT NOREPLICATION CREATEDB CREATEROLE LOGIN PASSWORD '1';"
psql -c "CREATE ROLE nfusr NOINHERIT NOREPLICATION LOGIN PASSWORD '1';"
```

* Создать таблицу

```
psql -c "create database DB_NAME with owner=nf_demo_company encoding='UTF8' tablespace=pg_default lc_collate='ru_RU.UTF-8' lc_ctype='ru_RU.UTF-8' connection limit=-1; 
```

## Установка платформы 


* В корне приложения выполнить команду 
```
npm i
```

* В корне в config.json
```
    "@nfjs/migrate": {
        "doMigrate": false,
        "doSilent": true,
        "checkType": "simple",
        "defaultRunType": "r",
        "defaultDoUnsafeDrop": false,
        "defaultDoInit": {
            "need": true,
            "appAdminName": "admin",
            "appAdminPassword": "admin"
        },
        "data_providers": {
            "default": {
                "superUserName": "pg",
                "superUserPassword": "Postgres64",
                "checkUserName": "nfadm",
                "checkUserPassword": "1",
                "adminUserName": "nfadm",
                "adminUserPassword": "1"
            }
        },
        "onlySchemas": null
    },
```

appAdminName, appAdminPassword - логин и пароль пользователя, который будет создан в качестве администратора.

superUserName, superUserPassword - логин и пароль от самой базы данных, необходимо для автоматической установки расширений в бд.

```
 "data_providers": {
        "default": {
            "connectConfig": {
                "host": "localhost",
                "port": 54320,
                "database": "nf_demo_company"
            },
            "name": "default",
            "type": "db-postgres",
            "connectType": "user",
            "credentialsSource": "session"
        }
    },
```

host и port указать свои

* Выполнить компанду

```
npm run migrate
```

* Если все успешно, выполнить команду 
```
npm run start
```

и залогиниться с admin/admin