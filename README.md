![Docker](https://github.com/FAForever/website/actions/workflows/release.yml/badge.svg?branch=develop)
[![GitHub license](https://img.shields.io/github/license/FAForever/website)](https://github.com/FAForever/website)

## About the FAForever Website

![Imgur](https://imgur.com/qU6OXoA.png)

This is the repository for our main website [FAForever.com](https://www.faforever.com)

The Main Focus for what the primary purpose of the website is. The following was voted on at the FAForever Association general meeting as the 2 main purposes of the website.

1. To Focus on Acquiring and On-boarding of new Player into FAForever (Registration of players, Documentation & Support)
2. Promote The Community (Clans, Maps, Mods, Tournaments etc.)


## Project's Hub

The Association also voted on the Guidelines for adding Projects to the Website as a Standalone page.
The Guidelines Can be found [here](https://github.com/FAForever/website/wiki/FAF-Project-Hub-Guidlines)


## Developing the Website
The Website is overseen currently by the Promotions Team.

The recommended 3 development environments to set up are listed below, the guide for each will outline what is needed, and what to configure.

- [JetBrains Webstorm](https://github.com/FAForever/website/wiki/Webstorm-Development-Enviroment)
- [Visual Studio Code](https://github.com/FAForever/website/wiki/Visual-Studio-Develeopment-Enviroment)
- [Oracle VM VirtualBox](https://github.com/FAForever/website/wiki/Oracle-VM-VirtualBox-Development-Enviroment)

Any pull requests made to the website will be verified via the Website Test Server before being merged into the website.

As well as any Pull Requests made please make sure you detail in the comments on files/changes.

## Other Ways to Contribute

We have a [POEditor](https://poeditor.com/join/project/vZ9QmP0fmb) set up to help in translating the terms in to the native language. you can click that link a
support the development by taking the time to work through the terms that get added to the site. Were not limited by how many languages we can support as long as someone wanted to put in the effort
in doing the translation support.

As of March 2022 the main 4 Languages that are set up on POEditor are:
- English
- Russian
- French
- German


# Code Guidelines

## How does the website currently operate?
Hello! This is a small introductory paragraph on how the website is organized. Specifically regarding adding or deleting PUG, SASS or JS.

### Adding PUG

PUG in the website is localized in templates > views. However, before adding a new PUG page, make sure to go to routes > views and make a js file with the exact name of your PUG page. Just copy another JS file and copy paste your new name.

### Adding SASS

Go to  public > styles > site.sass and add a line for your SASS page which should go in the site folder.

### Adding JS
Now name your JS file the same as your SASS and PUG file and place it under the app folder.

## Styling Guidelines (CSS/SASS)

With the creation of the FAF Website 4.0, we strive to make the new code far more compact. That is the keyword you want to use when creating CSS. Thanks to SASS, we can re-use and repeat the same styles and when needed, modify it on a specific page.

Currently, CSS Grid is the core of the website. With almost all (if not all) elements being inside a grid. This is done since CSS Grid offers insane flexibility and its very responsive to changes in screen size.

### Mixins and Variables

Currently, we use the _mixins.sass and _variables.sass to store these elements. Please, try using the already stablished colors and see if a previous mixin by serve your need. The previous website makers did not think about this and so they left 900 lines of variables... Re-using variables will not only do more with less code, but allow us for an easier change in color or adding accesibility buttons (since if we only need to change the color of 3-5 variables, its much easier to install color changing features than lets say 20-30 variables).

If you believe a variable or mixin could be written better, feel free to play with them. Just make sure your changes work well/don't break responsiveness.

### Colors and Aesthetics

Currently, we want the FAF website to have a very gray, black and mute color scheme. With our "highlight" color being the "gold" seen in the buttons. Remember what FAF stands for: Big robots, war, strategy, total control, community, muteness/unsaturated colors, etc. Ergo, try avoiding using flashy colors. 

### Artistic Freedom

Don't feel scared or worry about making changes. The FAF website needs as much help as it can get. 
