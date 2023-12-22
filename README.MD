## Подготовка к работе

* Установить GIT
* NodeJS 16+
* PostgreSQL 13+

## Подготовка базы данных 

>! Шаги могут быть пропущены при наличии готовой инсталляции

* Проинициализировать кластер

```sh
initdb --locale=ru_RU.UTF-8 --encoding=UTF8 -D /путь_где_будут_расположены_файлы_бд
```

* Поправить postgresql.conf, настроив параметры:
```
listen_addresses='*'
datestyle='iso, dmy'
nf.org = -1
```

* Создать роли

```sh
psql -c "CREATE ROLE nfadm NOINHERIT NOREPLICATION CREATEDB CREATEROLE LOGIN PASSWORD '1';"
psql -c "CREATE ROLE nfusr NOINHERIT NOREPLICATION LOGIN PASSWORD '1';"
```

* Создать базу данных

```sh
psql -c "create database DB_NAME with owner=nf_demo_company encoding='UTF8' tablespace=pg_default lc_collate='ru_RU.UTF-8' lc_ctype='ru_RU.UTF-8' connection limit=-1; 
```

## Установка приложения


* В корне приложения выполнить команду 
```
npm i
```

* В корне приложения создать `config.json` и наполнить минимально необходимыми блоками:

Настройки для инструмента обновления объектов базы данных 
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
                "superUserName": "postgres",
                "superUserPassword": "***",
                "checkUserName": "nfadm",
                "checkUserPassword": "1",
                "adminUserName": "nfadm",
                "adminUserPassword": "1"
            }
        },
        "onlySchemas": null
    },
```

`appAdminName`, `appAdminPassword` - логин и пароль пользователя, который будет создан в качестве администратора приложения.

`superUserName`, `superUserPassword` - логин и пароль от суперпользователя, который должен был быть создан при инсталляции PostgreSQL. Необходим для автоматической установки расширений в базу данных.

Настройки соединения с базой данной
```
 "data_providers": {
        "default": {
            "connectConfig": {
                "host": "localhost",
                "port": 5432,
                "database": "nf_demo_company"
            },
            "name": "default",
            "type": "db-postgres",
            "connectType": "user",
            "credentialsSource": "session"
        }
    },
```

`host` и `port` указать свои

* Выполнить команду создания объектов базы данных и данных таблиц

```
npm run migrate
```

* Если миграция завершилась успешно, выполнить команду запуска приложения 
```
npm run start
```

* В консоль должен вывестись веб адрес приложения, где залогиниться с `admin`/`admin`