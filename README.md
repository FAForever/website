![Docker](https://github.com/FAForever/website/actions/workflows/release.yml/badge.svg?branch=develop)
[![GitHub license](https://img.shields.io/github/license/FAForever/website)](https://github.com/FAForever/website)

## About the FAForever Website

![image](https://user-images.githubusercontent.com/96269542/213524773-227d8e6a-f932-4d79-8f72-c671bd73ce02.png)

This is the repository for our main website [FAForever.com](https://www.faforever.com)

The Main Focus for what the primary purpose of the website is. The following was voted on at the FAForever Association general meeting as the 2 main purposes of the website.

1. To Focus on Acquiring and On-boarding of new Player into FAForever (Registration of players, Documentation & Support)
2. Promote The Community (Clans, Maps, Mods, Tournaments etc.)

## Developing the Website / Setting up your local environment

### Option #1 - locally install node, yarn etc
Local installation without docker [guide](https://github.com/FAForever/website/wiki/Setting-up-a-local-environment-for-the-website)

### Option #2 - run everything in docker (linux, wsl2, mac)
Local requirements:
- docker
- docker compose

The website has dependencies to Hydra, Wordpress and the [Java-API](https://github.com/FAForever/faf-java-api).
You can run those with the [local-stack](https://github.com/FAForever/faf-stack).

If you got the [local-stack](https://github.com/FAForever/faf-stack) up and running, we need to stop the "faf-website" and replace it with a development container.
````bash
cd ../faf-stack # replace path if needed
docker compose stop faf-website
````

Development-Container:
`````bash
cd ../website # replace path if needed
cp -n .env.faf-stack .env
docker compose build 
docker compose run website yarn install
docker compose up 
`````

this should start the express-server on http://localhost:8020/.

## Other Ways to Contribute

We have a [POEditor](https://poeditor.com/join/project/vZ9QmP0fmb) set up to help in translating the terms in to the native language. you can click that link a
support the development by taking the time to work through the terms that get added to the site. Were not limited by how many languages we can support as long as someone wanted to put in the effort
in doing the translation support.

As of March 2022 the main 4 Languages that are set up on POEditor are:
- English
- Russian
- French
- German


