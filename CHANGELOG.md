# Changelog

## [0.42.1](https://github.com/samuelcsantana/pyxis-web/compare/v0.42.0...v0.42.1) (2026-10-29)


### Bug Fixes

* **account:** promise the return to free only when the API's mailbox check allows it ([e844d19](https://github.com/samuelcsantana/pyxis-web/commit/e844d19f0e12dc30a09c2147105347ffc23a4aa4))
* **sign-up:** ask an unfinished owner to subscribe without a trial while the free plan is on ([7bf37cc](https://github.com/samuelcsantana/pyxis-web/commit/7bf37cc83f8576992144e6a07474d970365baa1a))


### Documentation

* **features:** say the cancel promise follows the API's mailbox check ([ccd0575](https://github.com/samuelcsantana/pyxis-web/commit/ccd0575210c0d0512ec1ac41abfb3efedd43d80e))

## [0.42.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.41.2...v0.42.0) (2026-10-29)


### Features

* **sign-up:** read the free place the API answers at sign-up ([aa75ad8](https://github.com/samuelcsantana/pyxis-web/commit/aa75ad8192f36e951477a1862bc1f9dacd2feca6))
* **sign-up:** send an address whose mailbox has a free account to finish its subscription ([a099141](https://github.com/samuelcsantana/pyxis-web/commit/a0991417b9751701b060a58737beac841f3bbdb5))


### Documentation

* **features:** say where an address whose mailbox has a free account goes ([445449d](https://github.com/samuelcsantana/pyxis-web/commit/445449ddc31962ddae2872cdf4d97a0b289014c2))
* fold the reference sections of the README ([f2d69f2](https://github.com/samuelcsantana/pyxis-web/commit/f2d69f292667b01e96d52807668e389e3ad08f8d))
* keep the feature list short and move the detail to FEATURES.md ([1eb0782](https://github.com/samuelcsantana/pyxis-web/commit/1eb07826d3e805f2494659e47a4bb2bdc558f1d1))
* shorten the status note and point the roadmap at the changelog ([497da52](https://github.com/samuelcsantana/pyxis-web/commit/497da52c20933f3b8410e3f5fa18c83788da4d1c))

## [0.41.2](https://github.com/samuelcsantana/pyxis-web/compare/v0.41.1...v0.41.2) (2026-10-28)


### Documentation

* **readme:** describe the property-based tests ([ae10c79](https://github.com/samuelcsantana/pyxis-web/commit/ae10c79e9604c30c9436e419d50fde3703779d13))

## [0.41.1](https://github.com/samuelcsantana/pyxis-web/compare/v0.41.0...v0.41.1) (2026-10-28)


### Documentation

* **readme:** add the OpenSSF Scorecard badge ([4fc1c7d](https://github.com/samuelcsantana/pyxis-web/commit/4fc1c7dede7adceb8c68772cae026642ecf7574e))
* **readme:** bring the README up to the free plan ([d0d53d2](https://github.com/samuelcsantana/pyxis-web/commit/d0d53d249b397a5d005b32cbec6fdf03da6d1e27))

## [0.41.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.40.1...v0.41.0) (2026-10-28)


### Features

* **account:** close Account and billing with the support address ([2f3d0ed](https://github.com/samuelcsantana/pyxis-web/commit/2f3d0ede206a7a565a76cb1ddbe88c21e7b7e103))
* **help:** add the Help and support page ([aaee1e0](https://github.com/samuelcsantana/pyxis-web/commit/aaee1e0f542dc88076fe5e7cccbb39a4dbe2b5c6))
* **landing:** give the support address and reply times in the footer and the FAQ ([dbf45fd](https://github.com/samuelcsantana/pyxis-web/commit/dbf45fdb5fb69b1a7d4dd7773ad630a7496d3769))
* **landing:** tell agents in llms.txt where to send a person who needs help ([59f8ff7](https://github.com/samuelcsantana/pyxis-web/commit/59f8ff7e45968b4c030e8f29b3808cc7abb5db77))
* **sign-in:** name the support address when a code does not arrive ([96d945d](https://github.com/samuelcsantana/pyxis-web/commit/96d945d93ef19cc1eae65e845c1da525e1b81ab8))


### Refactoring

* **shell:** keep the install address with the other screen addresses ([5553999](https://github.com/samuelcsantana/pyxis-web/commit/55539991e8f658e6dc6babbddb994fee2f023a0f))


### Documentation

* **readme:** describe the help page and where the support address shows ([8a775f0](https://github.com/samuelcsantana/pyxis-web/commit/8a775f09208663db4549d38b6edb9b66a8bb9387))
* **readme:** note the support channels on the home page and in llms.txt ([e19bbdb](https://github.com/samuelcsantana/pyxis-web/commit/e19bbdb48ee6f5be8b5db3a4615963ab6b85d76c))

## [0.40.1](https://github.com/samuelcsantana/pyxis-web/compare/v0.40.0...v0.40.1) (2026-10-28)


### Bug Fixes

* **landing:** count the sixteen tools of the Claude connector ([a9f9653](https://github.com/samuelcsantana/pyxis-web/commit/a9f9653bc10aff86881689d795116278d5c95d2f))

## [0.40.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.39.0...v0.40.0) (2026-10-28)


### Features

* **account:** drop the free trial from the Account texts while the free plan is on ([68c560c](https://github.com/samuelcsantana/pyxis-web/commit/68c560c3de09317c3f9409d6b6ec83230bda9969))
* **account:** promise the return to the free plan only when its terms bind the account ([96e5e11](https://github.com/samuelcsantana/pyxis-web/commit/96e5e11dafeb57a7bc4b2976ee14fe515ac28e3a))
* **account:** show a free account its usage, the day to fit by and the paid plan ([e8e45d9](https://github.com/samuelcsantana/pyxis-web/commit/e8e45d90214fb69a454531acf6a99ee1208a894f))
* **accounts:** know when an account waits for a free place ([9f4f0d7](https://github.com/samuelcsantana/pyxis-web/commit/9f4f0d7dd74f2ccd5998ea02921739e4a34c9cca))
* **accounts:** read the free-plan fit and know what cancelling or withdrawing does ([be55db0](https://github.com/samuelcsantana/pyxis-web/commit/be55db08c2c545de5dc6e0e12857720893d89725))
* **accounts:** withdraw to the free plan and subscribe from it ([6442293](https://github.com/samuelcsantana/pyxis-web/commit/6442293914b51241867c0d448bb60dcf5168da49))
* **account:** tell a paused free account it comes back on the 1st or once subscribed ([e2c1392](https://github.com/samuelcsantana/pyxis-web/commit/e2c1392984bfa2e37feb8cf6cb2001856cda88b3))
* **account:** tell a paying owner what cancelling does and offer the withdrawal ([1a9c4cb](https://github.com/samuelcsantana/pyxis-web/commit/1a9c4cbfafc6db2a7a234bafeb31df02785506d3))
* **dashboard:** a filter button after the name of each row ([1965d86](https://github.com/samuelcsantana/pyxis-web/commit/1965d86e2b2de51ebe793ae4eb67a70b90c230e4))
* **dashboard:** show the filters on every screen and keep them in its links ([8fa9b15](https://github.com/samuelcsantana/pyxis-web/commit/8fa9b1571296a9b9491b17c80eacdbb85b500004))
* **domain:** turn a dashboard filter on or off from a row ([d05e5f0](https://github.com/samuelcsantana/pyxis-web/commit/d05e5f01b88070310023b9667b786cdd64d66c6a))
* **features:** read the median of a numeric event property ([6903e7a](https://github.com/samuelcsantana/pyxis-web/commit/6903e7affeb5f8c92c212e4825e4b58257450e32))
* **features:** show the median of a numeric property, split by another ([9f7ea63](https://github.com/samuelcsantana/pyxis-web/commit/9f7ea63c2fe3186be57e73195d3c095a11da0443))
* **landing:** answer the free plan's questions ([e16c76e](https://github.com/samuelcsantana/pyxis-web/commit/e16c76e7b8df7cad772356dc31f5facba8c7ffb8))
* **landing:** lead with the free plan in the hero, the install steps and the description ([8b785db](https://github.com/samuelcsantana/pyxis-web/commit/8b785dbd26a6d11aacfbb955914ce0000a03e951))
* **landing:** show the free and the paid plan side by side ([0e09e78](https://github.com/samuelcsantana/pyxis-web/commit/0e09e78e40f8429c7d6f2e0525c507d8c44b24cc))
* **legal:** publish terms 1.3 for the free plan ([905eaab](https://github.com/samuelcsantana/pyxis-web/commit/905eaabf3efcf55915257bcdc4b580f423e8a465))
* **llms:** name the free plan in llms.txt once it is open ([af43c72](https://github.com/samuelcsantana/pyxis-web/commit/af43c729628a6e5617405e90777907a96ca03892))
* **reports:** send the dashboard filters with every report ([13b0ac8](https://github.com/samuelcsantana/pyxis-web/commit/13b0ac8edd4db1d6bfdbf6f6232ed0e631f2fbf3))
* **shell:** keep the dashboard filters across screens and periods ([546a655](https://github.com/samuelcsantana/pyxis-web/commit/546a655e58cae2ea30c30479eacd5bf6cf874cc5))
* **sign-in:** offer to start free when the free plan is open ([2634052](https://github.com/samuelcsantana/pyxis-web/commit/26340525a6ae16ac0c66981b1c558a75596fe830))
* **sign-up:** read the free plan's state and the new account's status ([ec03c4a](https://github.com/samuelcsantana/pyxis-web/commit/ec03c4a8f05cd653d47ec235d0e8f8bf2fdb077c))
* **sign-up:** start new owners on the free plan without payment ([da75b39](https://github.com/samuelcsantana/pyxis-web/commit/da75b398670cad375a4d7a1f6116a40396582d18))
* **visits:** filter visits by browser and system ([cccc695](https://github.com/samuelcsantana/pyxis-web/commit/cccc695c68f4a15fe11d0736ef7ab9bf1a42eb7a))
* **welcome:** confirm a subscription that leaves the free plan ([472618a](https://github.com/samuelcsantana/pyxis-web/commit/472618a891d002cc220bcac66036db1d30c109f3))
* **welcome:** welcome an owner who starts on the free plan ([adfc3d3](https://github.com/samuelcsantana/pyxis-web/commit/adfc3d3eeabfcf64bb0c4d176fe1dae910cec435))


### Refactoring

* **landing:** pass what sign-up offers instead of whether it is open ([19fd59d](https://github.com/samuelcsantana/pyxis-web/commit/19fd59d28de376a70ce047c0c9bbe542592ccd8b))


### Documentation

* describe the Account screen on the free plan ([9398aa3](https://github.com/samuelcsantana/pyxis-web/commit/9398aa3b3ff48f5c386635cbc137c9527f19efc1))
* describe the home page on the free plan ([233c533](https://github.com/samuelcsantana/pyxis-web/commit/233c533421ed4ec52afd38b2e4274ce9ac6a6fb4))
* describe the sign-up and welcome on the free plan ([fe76d22](https://github.com/samuelcsantana/pyxis-web/commit/fe76d22d1e53d5ea449cf862be6622bbedc63606))
* say the cancelling note waits for terms with the free plan to bind the account ([35eb951](https://github.com/samuelcsantana/pyxis-web/commit/35eb951f4c041b03081dbd65e37c1e674b91f97f))

## [0.39.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.38.1...v0.39.0) (2026-10-27)


### Features

* **accounts:** know the free plan status ([f123f8f](https://github.com/samuelcsantana/pyxis-web/commit/f123f8f7b7c48b5b4bc91b2304739f594799a5ef))
* **accounts:** say at how many events measuring paused ([370498c](https://github.com/samuelcsantana/pyxis-web/commit/370498c45c396ed4ba20b7263b8473bfb729f1e7))


### Bug Fixes

* **account:** count one project and one person in the singular ([2b09944](https://github.com/samuelcsantana/pyxis-web/commit/2b09944753e48cae741a609ec231a81acf5b311a))

## [0.38.1](https://github.com/samuelcsantana/pyxis-web/compare/v0.38.0...v0.38.1) (2026-10-25)


### Bug Fixes

* **landing:** keep the header on one row on tablets ([e979d8c](https://github.com/samuelcsantana/pyxis-web/commit/e979d8c1f0310b827abb97e0f17dd02f473d55f0))

## [0.38.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.37.0...v0.38.0) (2026-10-24)


### Features

* **landing:** link the install section from the header ([210bc89](https://github.com/samuelcsantana/pyxis-web/commit/210bc89abb67657afaf09752cc919dde8b2268d7))


### Bug Fixes

* **landing:** keep the header's section links on the home page ([4b75ccf](https://github.com/samuelcsantana/pyxis-web/commit/4b75ccf848da6b9f80aee465d74995ef8cd9613a))

## [0.37.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.36.0...v0.37.0) (2026-10-24)


### Features

* **i18n:** name Pyxis instead of "the tracker" in the dashboard ([0fa3aed](https://github.com/samuelcsantana/pyxis-web/commit/0fa3aed69a5a01bbfe5c4e03db355ae50111d0bb))
* **install:** add keyboard tabs for the ways to install ([9f64caf](https://github.com/samuelcsantana/pyxis-web/commit/9f64cafa799c361c507fc72e3126bfe19fd39380))
* **install:** offer installing Pyxis with an AI agent ([74f2333](https://github.com/samuelcsantana/pyxis-web/commit/74f233358f14081fb6332b922aee7900c49d4ba4))
* **install:** suggest checking the first events with Claude ([758d38d](https://github.com/samuelcsantana/pyxis-web/commit/758d38d1b41d00bfe3bae7c2cac159512b4e1ada))
* **install:** tell a phone that installing happens on a computer ([13d8927](https://github.com/samuelcsantana/pyxis-web/commit/13d8927c7ebb06fd2aeb397fdea5e73049afd3d6))
* **install:** write the request an AI agent needs to install Pyxis ([d139c1b](https://github.com/samuelcsantana/pyxis-web/commit/d139c1b56f88c3227e31d40ac9456c9720dab62d))
* **landing:** give the copy button a prominent look and announce each copy ([be85ca6](https://github.com/samuelcsantana/pyxis-web/commit/be85ca67da7cb9dad96ef81e974679635d996954))
* **landing:** highlight the card that installs Pyxis with an AI agent ([9bd2165](https://github.com/samuelcsantana/pyxis-web/commit/9bd216570aff9270e5efbd3e09674a1e4124472e))
* **landing:** make the card's robot cheer when its request is copied ([008024f](https://github.com/samuelcsantana/pyxis-web/commit/008024f51c1d2908144b7ed87e739ad8e2549f8a))
* **landing:** say "the Pyxis code" instead of "the tracker" ([a1024b3](https://github.com/samuelcsantana/pyxis-web/commit/a1024b359faf3c03b87720d8b394ff632b7a1ebc))
* **landing:** say the agent's request comes ready on the Install screen ([340401e](https://github.com/samuelcsantana/pyxis-web/commit/340401ea142eb7df444183acae5cad606383b4fb))


### Performance

* **landing:** keep the copy button out of pages that only link to pricing ([17606f1](https://github.com/samuelcsantana/pyxis-web/commit/17606f166c361b2ca171f0d12b2a103b94d48cfb))


### Refactoring

* **landing:** let each robot drawing name its own gradients ([4145cc1](https://github.com/samuelcsantana/pyxis-web/commit/4145cc176d25e175016ac776f6f589676ab77599))


### Documentation

* describe installing with an AI agent in the README ([c57ab92](https://github.com/samuelcsantana/pyxis-web/commit/c57ab9252e74801a69b7738a7a8a8b468275a167))
* describe the home page's AI-agent card in the README ([5afed3b](https://github.com/samuelcsantana/pyxis-web/commit/5afed3b52055fc758fb46bd1aa8221a2118c4bca))

## [0.36.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.35.0...v0.36.0) (2026-10-24)


### Features

* **shell:** keep the look of a screen read again with nothing new ([f80f1b4](https://github.com/samuelcsantana/pyxis-web/commit/f80f1b4f137ad3679d36bbd6840df28628a7b802))
* **shell:** leave display-only parameters out of a read's record ([d7db0ae](https://github.com/samuelcsantana/pyxis-web/commit/d7db0ae2f2b0d6dca0a838f307fde97dbf08ca8c))


### Bug Fixes

* **funnel:** keep the address's own mode and steps in the funnel's links ([7627cf9](https://github.com/samuelcsantana/pyxis-web/commit/7627cf92015ce6872ee5a3b51eaeeeaf29167577))


### Refactoring

* **requests:** name the route parameter in the requests domain ([5196630](https://github.com/samuelcsantana/pyxis-web/commit/519663028f638dde43ea54f1d972880327ce9858))


### Documentation

* record that a look keeps its marks across display-only re-reads ([92776dd](https://github.com/samuelcsantana/pyxis-web/commit/92776ddb905e96f0052fe38c0b33afc1aa9848e1))

## [0.35.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.34.0...v0.35.0) (2026-10-24)


### Features

* **acquisition:** leave a fresh slot beside each source and campaign count ([1c7d1a6](https://github.com/samuelcsantana/pyxis-web/commit/1c7d1a6553e0a8275bc6e1eaa2b8dea63abdfca6))
* **devices:** leave a fresh slot beside each device, country and region count ([44a33e4](https://github.com/samuelcsantana/pyxis-web/commit/44a33e4034c44382662425b586493b21154d606b))
* **features:** leave a fresh slot beside each feature's count ([3e82815](https://github.com/samuelcsantana/pyxis-web/commit/3e82815f4086c0c1e8b8d21c40df5661d04340a7))
* **funnel:** leave a fresh slot beside each step's count ([e11964b](https://github.com/samuelcsantana/pyxis-web/commit/e11964b80494923178b5c4092ff377ef75ebc27f))
* **overview:** leave a fresh slot beside each count of Overview ([48d1ac5](https://github.com/samuelcsantana/pyxis-web/commit/48d1ac50db4a7bb916f5ee9c8e2bcbe0b2de5c53))
* **requests:** leave a fresh slot beside each route's count ([9368a10](https://github.com/samuelcsantana/pyxis-web/commit/9368a10296140459d38b6d6e5dc8584b144fda87))
* **shell:** count apart what arrived for the screen being shown ([c2f44ef](https://github.com/samuelcsantana/pyxis-web/commit/c2f44ef2ac963ac2ca0b6650bc0e2f3b4f021675))
* **shell:** keep on the device the numbers each screen read showed ([51789ba](https://github.com/samuelcsantana/pyxis-web/commit/51789ba4cd7540ce13ed0bc2fc4e9940c2d7e2f1))
* **shell:** mark on the content what went up since the last read ([2f29e5a](https://github.com/samuelcsantana/pyxis-web/commit/2f29e5a430de6ee33f6df3bb08b76d0ce8381fb7))
* **shell:** note the address of each screen read ([e9d7afe](https://github.com/samuelcsantana/pyxis-web/commit/e9d7afefb7aae853e0831941beac569a72261921))
* **shell:** offer to refresh the screen shown with what arrived for it ([8f65da5](https://github.com/samuelcsantana/pyxis-web/commit/8f65da5a1979d00378378a0f1ef9eedb4a2b63e0))
* **shell:** publish the visits on the site now from each answer ([d93be03](https://github.com/samuelcsantana/pyxis-web/commit/d93be0302bd98e607bbb872f1573501a6f101391))
* **shell:** show the visits on the site now beside the Overview title ([27b3987](https://github.com/samuelcsantana/pyxis-web/commit/27b3987296f22fc59f62100990b1cadf1687ad91))
* **visits:** leave a fresh slot on each visit's start ([1dc30d2](https://github.com/samuelcsantana/pyxis-web/commit/1dc30d26bfe3ec00ea9a3856a9823c1113598af3))


### Refactoring

* **shell:** build the arrival stores from one small value store ([b1b97bc](https://github.com/samuelcsantana/pyxis-web/commit/b1b97bcdf68365efbe0d1566a0cb1e73754a11fd))


### Documentation

* describe the news bar of the screen being shown ([f884e65](https://github.com/samuelcsantana/pyxis-web/commit/f884e6530e3610cc66d7a64a18123d1c611eaede))
* describe the visits on the site now ([1369742](https://github.com/samuelcsantana/pyxis-web/commit/136974272b51f41f814a11bdbb911b1fed7896f3))
* record that what went up since the last read fills server-drawn slots ([e2c37bd](https://github.com/samuelcsantana/pyxis-web/commit/e2c37bd96d5f32b7207bab1751f278ea8117e284))
* **shell:** show the fresh marks in Storybook ([24ec41b](https://github.com/samuelcsantana/pyxis-web/commit/24ec41b34038aa8727efcf7c7086b3679073ab70))

## [0.34.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.33.1...v0.34.0) (2026-10-24)


### Features

* **arrivals:** answer the browser what reached the project ([48c5926](https://github.com/samuelcsantana/pyxis-web/commit/48c5926f66be817bd977d49e9cd8762619594138))
* **arrivals:** read what reached a project since a moment ([f05ec08](https://github.com/samuelcsantana/pyxis-web/commit/f05ec081fdc4b3c0e4af432ae7ae65f2fba07d72))
* **shell:** count arrivals per screen and pace the questions about them ([84f3dad](https://github.com/samuelcsantana/pyxis-web/commit/84f3dadfddc2e8b1a35d0d76f562e415cc5cb774))
* **shell:** count on the menu what arrived since each screen was seen ([714514a](https://github.com/samuelcsantana/pyxis-web/commit/714514abca1a0f6dfffc9b3d11ee0fe2d7a6d409))
* **shell:** keep on the device which screens of a project were seen ([fde9fc3](https://github.com/samuelcsantana/pyxis-web/commit/fde9fc354acfbae99f6fe3b7ab16a9ddab9afdf8))


### Documentation

* record that arrivals are polled and counted on the device ([18c2bf6](https://github.com/samuelcsantana/pyxis-web/commit/18c2bf68264cbcaa59908601eb225d1fa41dab08))

## [0.33.1](https://github.com/samuelcsantana/pyxis-web/compare/v0.33.0...v0.33.1) (2026-10-24)


### Bug Fixes

* **shell:** show a loading placeholder while a screen has no content ([43d386d](https://github.com/samuelcsantana/pyxis-web/commit/43d386de2af2b0bb042c01b9d16311a39b698a5b))


### Refactoring

* **states:** name the layout of a screen's loading state ([dbe2e54](https://github.com/samuelcsantana/pyxis-web/commit/dbe2e54a5743fd52da4ff5e4fc99d34e5c29b495))


### Documentation

* record the loading placeholder for a screen opened before its prefetch ([83b506c](https://github.com/samuelcsantana/pyxis-web/commit/83b506c0aa7f2b03b80d6e5b34f111caf7a18d5b))

## [0.33.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.32.0...v0.33.0) (2026-10-23)


### Features

* **shell:** a screen top bar that reads the screen and the period from the URL ([8e4219c](https://github.com/samuelcsantana/pyxis-web/commit/8e4219c64b2d16babfe56a77534928ad37108459))
* **shell:** anchor the project's day on the server clock in the browser ([208ac9b](https://github.com/samuelcsantana/pyxis-web/commit/208ac9b8db78bc5fe781eca0c73b02159295a3ea))
* **shell:** fetch a screen when the pointer rests on its link ([711bb32](https://github.com/samuelcsantana/pyxis-web/commit/711bb32fa0a102e6e3c1ba89a4ff5f3bdc61e8b7))
* **shell:** keep one top bar mounted across the eight screens ([f609e63](https://github.com/samuelcsantana/pyxis-web/commit/f609e631e82ad059243c6c3d2045ced70bcda8b4))
* **shell:** read a screen again in place when it comes back stale from the cache ([1247647](https://github.com/samuelcsantana/pyxis-web/commit/1247647bff7fbbb6dd92f0768dee31154a5f6226))
* **shell:** read the screen, the period and the carried filters from an address ([bb80bae](https://github.com/samuelcsantana/pyxis-web/commit/bb80bae8ca5cbd107aeafc5fae51c528a557db38))


### Bug Fixes

* **settings:** drop the cached screens when the project changes ([4125341](https://github.com/samuelcsantana/pyxis-web/commit/412534190624df15c219deb36ea76a804622db4b))


### Refactoring

* **shell:** give the period pieces texts and formats, not the server i18n ([aabddf9](https://github.com/samuelcsantana/pyxis-web/commit/aabddf933c5a62fc80c5a3eb1472e09508ffec81))
* **shell:** give the small helpers the browser needs modules of their own ([b7d7f12](https://github.com/samuelcsantana/pyxis-web/commit/b7d7f12c37150b3bb598f571f512bce403a7f5c2))


### Documentation

* record why a visited screen comes back from the client cache ([be2a9d1](https://github.com/samuelcsantana/pyxis-web/commit/be2a9d18934c5c405235872eda38d9db25bf4e5b))
* record why the top bar of the eight screens stays mounted ([8b309f9](https://github.com/samuelcsantana/pyxis-web/commit/8b309f9e3689482ecf91e95044fbc429f6e4f319))
* say that resting the pointer on a screen fetches it ahead ([3f8b5d9](https://github.com/samuelcsantana/pyxis-web/commit/3f8b5d9edccde84e9bbe02e34e3bf5f0e5e1b273))

## [0.32.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.31.0...v0.32.0) (2026-10-22)


### Features

* **landing:** point to trackRequest under the install snippet ([b403b79](https://github.com/samuelcsantana/pyxis-web/commit/b403b795f10913787df02ca3fff756b9bb91d910))


### Bug Fixes

* **i18n:** call a write an escrita in Brazilian Portuguese ([ceed0d6](https://github.com/samuelcsantana/pyxis-web/commit/ceed0d6b920d779b8ed83d46217d6a7afb8fafc7))
* **i18n:** call the demo data fictional in Brazilian Portuguese ([58e30fd](https://github.com/samuelcsantana/pyxis-web/commit/58e30fd012ff109db03238d60244121e39d01871))
* **landing:** count four repositories in the coverage claims ([8945ede](https://github.com/samuelcsantana/pyxis-web/commit/8945edec993426ec3be17cbddd6f600ebb18857e))
* **landing:** read the license tile naturally in Portuguese and Spanish ([6108b7f](https://github.com/samuelcsantana/pyxis-web/commit/6108b7fc9c064d698b9d9ff5a5262ba5474b8571))

## [0.31.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.30.0...v0.31.0) (2026-10-21)


### Features

* **landing:** offer a prompt to paste into an AI agent ([f781c2b](https://github.com/samuelcsantana/pyxis-web/commit/f781c2bf802d47f5eccab005744f1ac48a4492e3))
* **llms:** add what the install rehearsal found missing to the recipe ([cf9879c](https://github.com/samuelcsantana/pyxis-web/commit/cf9879c54c2d4c845651d192194b4ec98327b070))


### Bug Fixes

* **landing:** give the agent prompt the full width on phones ([f188db2](https://github.com/samuelcsantana/pyxis-web/commit/f188db28c1ebab43dc8062f665a204b4d87dbc7e))


### Refactoring

* **landing:** name how a code block wraps its lines ([dd1e006](https://github.com/samuelcsantana/pyxis-web/commit/dd1e006d908e0001414842a3a22f86e45c957579))

## [0.30.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.29.0...v0.30.0) (2026-10-21)


### Features

* **demo:** give the demo people example.com addresses ([4951579](https://github.com/samuelcsantana/pyxis-web/commit/4951579028b4cba443728a9f720b0e6b34e53756))
* **demo:** name the demo store "My site", in the reader's language ([bc47081](https://github.com/samuelcsantana/pyxis-web/commit/bc47081234f73605acf31dd58fffff51ed5450fc))
* **landing:** add a section on who Pyxis is for ([3d64af1](https://github.com/samuelcsantana/pyxis-web/commit/3d64af14c621787ee59d95f0e8381db4e8afedd5))
* **landing:** answer agencies, non-coders and AI installs in the FAQ ([bc4f09e](https://github.com/samuelcsantana/pyxis-web/commit/bc4f09ea61d89a6d5639814125aed0c01229e455))
* **landing:** compare failed requests and tracker size ([24630ee](https://github.com/samuelcsantana/pyxis-web/commit/24630ee12fe3666dc3e6256acd1dd60a7b779518))
* **landing:** fold the In production section into Built in public ([6a699ed](https://github.com/samuelcsantana/pyxis-web/commit/6a699ed51f15718f93495a586f9a4d3fe8d716f2))
* **landing:** lead with what converts and what fails on your site ([2d64905](https://github.com/samuelcsantana/pyxis-web/commit/2d649050ab56637d05d65539b8837ac34ed4b491))
* **landing:** make the free trial the hero's main button ([b44cdf5](https://github.com/samuelcsantana/pyxis-web/commit/b44cdf5ced3fa30aaceac510539a44e24dfea17c))
* **landing:** put the dashboard, Claude and pricing before the engineering ([cbdadaa](https://github.com/samuelcsantana/pyxis-web/commit/cbdadaa250c14656e8773f03f01ba77617c40b05))
* **landing:** say what converts and what fails in the search result ([e9e1b1d](https://github.com/samuelcsantana/pyxis-web/commit/e9e1b1d1396654c2036a4a83b4eb094c40286bd1))
* **landing:** send people to Claude's connector directory first ([58a18fd](https://github.com/samuelcsantana/pyxis-web/commit/58a18fda2719ea0f152ce00e413b13fa44d1e8cd))
* **landing:** show how to start, in three steps, before the code ([498ce0d](https://github.com/samuelcsantana/pyxis-web/commit/498ce0d662926175e857579d1386227b6bcd1d0d))
* **landing:** show the biggest drop-off and the failing write on the preview ([2220305](https://github.com/samuelcsantana/pyxis-web/commit/22203058aa6c117d32c5560b2177c11c4bab9de1))
* **landing:** show the weekly digest e-mail in a Reports section ([8b5e27d](https://github.com/samuelcsantana/pyxis-web/commit/8b5e27dfbc61c1d5cb4e63b10fd9e6bd09fac59d))
* **landing:** turn the "Need more?" card into one for agencies ([3aff0e3](https://github.com/samuelcsantana/pyxis-web/commit/3aff0e383a0a362ad25c30ea2f14f926518eadcc))
* **llms:** give coding agents the install recipe ([2506e2d](https://github.com/samuelcsantana/pyxis-web/commit/2506e2d742e66a1600ce23b6ec06af409562b64f))


### Bug Fixes

* **install:** load the plain-HTML snippet from jsDelivr ([ce70048](https://github.com/samuelcsantana/pyxis-web/commit/ce700483b395429d9f1f359d52e9071787d5b075))
* **install:** pin the plain-HTML snippet to the tracker version installed here ([2dbb8d7](https://github.com/samuelcsantana/pyxis-web/commit/2dbb8d7c55c9d84dab740de1260d1094bc78362e))


### Refactoring

* **funnel:** name the worst transition of a funnel ([a58193a](https://github.com/samuelcsantana/pyxis-web/commit/a58193a9e0e8c02ac0d6170d038137a9f1a39931))


### Documentation

* **readme:** bring the status and the roadmap up to date ([8255f13](https://github.com/samuelcsantana/pyxis-web/commit/8255f1325d266db296ca5be4a2ee7f8104f6d82d))

## [0.29.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.28.0...v0.29.0) (2026-10-19)


### Features

* **landing:** convert the plan price into the reader's currency ([2ef88f4](https://github.com/samuelcsantana/pyxis-web/commit/2ef88f45e55bddf45f15c9ac8077a8835de15c72))
* **landing:** read the euro reference rates on the server, best effort ([9731b1c](https://github.com/samuelcsantana/pyxis-web/commit/9731b1c9847bbf1fe325be76a58dc6edec4a08ab))
* **landing:** show the plan price in the reader's currency, approximately ([2fb353c](https://github.com/samuelcsantana/pyxis-web/commit/2fb353c3a88e5ae150f4582d5408db3e72d80998))


### Bug Fixes

* **landing:** keep the billing period switch on one row on a phone ([7988c26](https://github.com/samuelcsantana/pyxis-web/commit/7988c2605d93440d5f422f350796fd2d26eee3fd))


### Documentation

* **readme:** describe the approximate price and its exchange rates ([0efc90c](https://github.com/samuelcsantana/pyxis-web/commit/0efc90c2f504e3b6f9aca14261b374c6abf9e206))

## [0.28.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.27.0...v0.28.0) (2026-10-19)


### Features

* **i18n:** ship the dashboard in German, French, Italian and Dutch ([4020452](https://github.com/samuelcsantana/pyxis-web/commit/40204525f5482e0b2f31393563dfe6393886e8e2))
* **i18n:** translate the dictionary into German, French, Italian and Dutch ([cc06788](https://github.com/samuelcsantana/pyxis-web/commit/cc06788f733e40df35d0e7cf161c28094337b2ed))
* **landing:** serve the home page in German, French, Italian and Dutch ([f83207d](https://github.com/samuelcsantana/pyxis-web/commit/f83207d1e98a92468a9d134a4681840cad209a20))
* **legal:** add courtesy translations of the contract documents ([21928d7](https://github.com/samuelcsantana/pyxis-web/commit/21928d7d0779d16cdd14fd900e09ab970bc99de5))
* **legal:** serve each translation of the contract in its language ([a8bfea6](https://github.com/samuelcsantana/pyxis-web/commit/a8bfea6caf7d1205720b4447fbb9a28e2bcb2699))


### Bug Fixes

* **devices:** let the keyboard reach a share table that scrolls sideways ([ceaeeb8](https://github.com/samuelcsantana/pyxis-web/commit/ceaeeb82c8038dbaa182cfd6c6188e9e4f4e9762))
* **landing:** let long German and Dutch words wrap at large text sizes ([e9c18be](https://github.com/samuelcsantana/pyxis-web/commit/e9c18be44f69fd06f10cf94fe080644291c461fc))

## [0.27.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.26.0...v0.27.0) (2026-10-18)


### Features

* **landing:** keep the visit's source when / opens another language ([3612e1d](https://github.com/samuelcsantana/pyxis-web/commit/3612e1da7784dbb6244b652e450f67e98a17bf8b))
* **landing:** remember the language and open it before the first paint ([157d3d7](https://github.com/samuelcsantana/pyxis-web/commit/157d3d7e0fcc177be2baca84106898b1b64d83be))
* **language:** add a language select with each language's flag ([b377ac3](https://github.com/samuelcsantana/pyxis-web/commit/b377ac3ccb568d268cfd1bb92c757f4e89f2c367))
* **sign-in:** share one header with sign-up, with the language select ([3be4ae6](https://github.com/samuelcsantana/pyxis-web/commit/3be4ae6918ec31107c2e392dfa47e1262fbf044f))


### Performance

* **language:** draw the language select on the server ([a60d018](https://github.com/samuelcsantana/pyxis-web/commit/a60d01876f0c348691d5fe273c400ac8e306d617))


### Documentation

* **adr:** record how the move from / keeps the visit's source ([28148d8](https://github.com/samuelcsantana/pyxis-web/commit/28148d801162fd46cd16184adfe188088caa49ad))
* record how the home page picks its language ([1d05bee](https://github.com/samuelcsantana/pyxis-web/commit/1d05bee25d3df26481c0553730ea9d1c4bc23c54))

## [0.26.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.25.1...v0.26.0) (2026-10-17)


### Features

* **landing:** float a nudge to the Claude connector ([b2af0a7](https://github.com/samuelcsantana/pyxis-web/commit/b2af0a745070221762296a6be76847d52f153000))
* **landing:** give the Claude connector its own section ([6f1e77d](https://github.com/samuelcsantana/pyxis-web/commit/6f1e77d707ad329a1de7310a5125e844b6471ce7))
* **landing:** glide to a section when a link of the page points to it ([6d27e75](https://github.com/samuelcsantana/pyxis-web/commit/6d27e756f4077c9d820ff51b653732cd5b98f85c))
* **landing:** keep the address on the section being read ([61fcfc0](https://github.com/samuelcsantana/pyxis-web/commit/61fcfc01bf8c0d7e222fdde9bd7c827817019cc6))
* **landing:** play the example conversation as it comes into view ([5a05c64](https://github.com/samuelcsantana/pyxis-web/commit/5a05c648eb01b0bd18d22153107450160eb453d6))
* **landing:** send the robot off once the reader reaches its section ([c3243c0](https://github.com/samuelcsantana/pyxis-web/commit/c3243c019400c39eb60e17650ab679116ccfabd1))
* **landing:** switch language on the section being read ([d1d8f77](https://github.com/samuelcsantana/pyxis-web/commit/d1d8f77378813f49baa097838ec218b714db9e62))
* **landing:** turn the nudge into a robot, drop the Brazil note and GitHub link ([a7abb9d](https://github.com/samuelcsantana/pyxis-web/commit/a7abb9dbdd3b20f4205b7e93d12a98274c9099be))
* **proxy:** serve the home page on preview deployments of the demo ([09e828e](https://github.com/samuelcsantana/pyxis-web/commit/09e828e27f1d8128709e77862f82a08431016548))
* **sign-in:** point visitors without an account to the plans ([5da2fb6](https://github.com/samuelcsantana/pyxis-web/commit/5da2fb6a757688549e3e6c185a2ec4d5f5b776f5))


### Bug Fixes

* **contract:** carry the project time zone the API now sends with times ([fc53568](https://github.com/samuelcsantana/pyxis-web/commit/fc53568d98cf651f41250c23be0b28ee1d5c9e22))


### Performance

* **landing:** fetch the other languages before the visitor picks one ([183edf2](https://github.com/samuelcsantana/pyxis-web/commit/183edf2eb5650a58fe2cadc6a703298d0074ebd8))
* **landing:** fetch the robot after the page, not with it ([b8f181a](https://github.com/samuelcsantana/pyxis-web/commit/b8f181a6f36ef7738b1866c9e624a931048ea293))


### Documentation

* **readme:** describe how the home page keeps and reaches its sections ([72c60fa](https://github.com/samuelcsantana/pyxis-web/commit/72c60fae89ae4656ad724014f2b616963367bf51))

## [0.25.1](https://github.com/samuelcsantana/pyxis-web/compare/v0.25.0...v0.25.1) (2026-10-16)


### Bug Fixes

* **landing:** stop measuring browsers driven by automation ([ca5db56](https://github.com/samuelcsantana/pyxis-web/commit/ca5db56b7b22ee23035798f47349dcfe786e990e))


### Documentation

* **readme:** say that the home page does not measure a browser driven by automation ([d3524c3](https://github.com/samuelcsantana/pyxis-web/commit/d3524c3943118b23ec52d4f9067025f8ffdb700b))

## [0.25.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.24.0...v0.25.0) (2026-10-16)


### Features

* **acquisition:** name the ad click that came with no source ([7c3a233](https://github.com/samuelcsantana/pyxis-web/commit/7c3a233c0d5b45f40f6f729895acc0471457f254))
* **demo:** bring some of the store's ad clicks with no source ([5ce1af8](https://github.com/samuelcsantana/pyxis-web/commit/5ce1af8c8f237e79c252d177951fe8bcd09ffc31))


### Documentation

* **readme:** name the ad click that arrives with no source ([43ca454](https://github.com/samuelcsantana/pyxis-web/commit/43ca454c25823255b974f2c83e70ce6d497f717a))
* **storybook:** show the sources table in Portuguese ([2b87827](https://github.com/samuelcsantana/pyxis-web/commit/2b87827d877a19b6be119e3c65666816c174aa49))

## [0.24.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.23.0...v0.24.0) (2026-10-16)


### Features

* **connect:** ask the admin to allow or cancel an app's connection ([9557adc](https://github.com/samuelcsantana/pyxis-web/commit/9557adcfb9aaa3ce1e9c3050624a343e47c8eecd))
* **connect:** come back to the consent page after signing in ([c0e7483](https://github.com/samuelcsantana/pyxis-web/commit/c0e74836b527b23ed9cd0d8a757e743b4e2928a4))
* **connect:** read and answer connection requests ([97b36fb](https://github.com/samuelcsantana/pyxis-web/commit/97b36fbdca1059bd3693ae51f5196ab6d33e9da4))
* **connect:** say where the data goes before Allow ([7447d11](https://github.com/samuelcsantana/pyxis-web/commit/7447d116880de04a7496fdffc846be5815da8a45))
* **landing:** point to the Claude connector and the open sign-up ([8da7b35](https://github.com/samuelcsantana/pyxis-web/commit/8da7b35ca267464f4de27401feed091ff9370296))
* **legal:** publish version 1.2 of the contract documents ([a7bf910](https://github.com/samuelcsantana/pyxis-web/commit/a7bf910c727ca74bd3912b0d37a192581c35090f))
* **llms:** tell agents how to reach the MCP server ([513aa39](https://github.com/samuelcsantana/pyxis-web/commit/513aa39a7a62a69392a00854ce1fd3aa0adf6489))
* **settings:** read and revoke the admin's connected apps ([27c3f66](https://github.com/samuelcsantana/pyxis-web/commit/27c3f66a291d74cfa4dcaff9bc421b1403f1da7d))
* **settings:** show connected apps and how to connect Claude ([fad3b7f](https://github.com/samuelcsantana/pyxis-web/commit/fad3b7f2434b8a0f068a0993e5bde726bbd259a5))


### Refactoring

* **settings:** share the revoke button between tokens and other rows ([7a7cd61](https://github.com/samuelcsantana/pyxis-web/commit/7a7cd614cda0230134f635154735bcdf94bd3817))


### Documentation

* **readme:** add pyxis-mcp to the ecosystem table ([a45b86a](https://github.com/samuelcsantana/pyxis-web/commit/a45b86a16d23786579c2f09b564be26310845b4b))
* **readme:** describe the connected apps panel ([f21b6a1](https://github.com/samuelcsantana/pyxis-web/commit/f21b6a190f071e33fcf5ad10e01fa8302d341724))
* **readme:** describe the consent page of the Claude connector ([35f6c1d](https://github.com/samuelcsantana/pyxis-web/commit/35f6c1de0875c7538aff3ee7186c10ad4597e287))

## [0.23.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.22.0...v0.23.0) (2026-10-15)


### Features

* **landing:** invite larger needs in pricing instead of the self-hosting card ([e78a5d6](https://github.com/samuelcsantana/pyxis-web/commit/e78a5d62b32613c27682313b36b0bd7b4c3b633d))

## [0.22.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.21.0...v0.22.0) (2026-10-15)


### Features

* **landing:** add the hosted plan's price to the home page ([1134c56](https://github.com/samuelcsantana/pyxis-web/commit/1134c56b18d86ced35ca5239e2fd78a064482844))
* **landing:** answer the price, trial, cancelling, limits and payment in the FAQ ([e74a045](https://github.com/samuelcsantana/pyxis-web/commit/e74a0456e8970f4752f2a420565e0dbae2d91a1d))
* **landing:** lead to the pricing from the hero, the header and the footer ([fbb21ca](https://github.com/samuelcsantana/pyxis-web/commit/fbb21cac681486dba20c19fc6501072768f56196))
* **landing:** let the copy button sit beside the text it copies ([ed81280](https://github.com/samuelcsantana/pyxis-web/commit/ed81280301e0bd3ca7be34495b13bb0567374ced))
* **landing:** offer the free trial once sign-up is open, and answer as the terms do ([0a93519](https://github.com/samuelcsantana/pyxis-web/commit/0a93519388bc3b2f34ce6b3d8950f01106f64918))
* **legal:** link the contract and identify the seller on the home page and at sign-up ([df3bd1a](https://github.com/samuelcsantana/pyxis-web/commit/df3bd1a20181e2a920a0d444a5d7cbccd7e41942))
* **legal:** render the contract documents from their Markdown text ([a0cc2a6](https://github.com/samuelcsantana/pyxis-web/commit/a0cc2a6e1d7f7fb28f80c63773761e986967da24))
* **legal:** serve the contract documents on the main domain ([f05d531](https://github.com/samuelcsantana/pyxis-web/commit/f05d531d384bee0b9fecb1d63d28270aec724a35))
* **sign-up:** start on the billing interval the link asks for ([192f358](https://github.com/samuelcsantana/pyxis-web/commit/192f358f4b6db86a1167fa2da197aae30665d0fb))


### Bug Fixes

* **landing:** break a section title's word that is wider than the line ([ebd2a71](https://github.com/samuelcsantana/pyxis-web/commit/ebd2a71afc5431f4e7f0206ca1f7c2000fdb0173))
* **legal:** give each scrollable table its own name ([de051f4](https://github.com/samuelcsantana/pyxis-web/commit/de051f47b79f9c5890c6ffd713946d7578761cb7))


### Refactoring

* **legal:** read the documents from disk apart from rendering them ([03a141e](https://github.com/samuelcsantana/pyxis-web/commit/03a141e845fc363bc7819ada209072bf8e0d5035))


### Documentation

* **readme:** describe the contract documents and the seller configuration ([b8b2baa](https://github.com/samuelcsantana/pyxis-web/commit/b8b2baa1038231b84089159e130dfb22b14279b1))
* **readme:** describe the free trial button of the home page ([e768e6a](https://github.com/samuelcsantana/pyxis-web/commit/e768e6a489c13a67564a63cae900341b19ae5812))

## [0.21.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.20.0...v0.21.0) (2026-10-15)


### Features

* **account:** offer an ended account to subscribe again ([847e9c7](https://github.com/samuelcsantana/pyxis-web/commit/847e9c760ef760293c10595032b03d7f48194008))
* **account:** say until when the account is exempt from the pause ([9d7d130](https://github.com/samuelcsantana/pyxis-web/commit/9d7d130df232af02e89823af2f1dafa5729909ab))
* **accounts:** read the pause exemption and the stages of subscribing again ([d65dead](https://github.com/samuelcsantana/pyxis-web/commit/d65dead11e92d06adeb424680ea5a4042879ad64))
* **projects:** read a suspended event reception and a held deletion ([efd5468](https://github.com/samuelcsantana/pyxis-web/commit/efd54687dc29ee3dacb13f7421a6586178399b0e))
* **settings:** explain a project with no live public key and how to replace it ([f495c5e](https://github.com/samuelcsantana/pyxis-web/commit/f495c5e7e8a305b63ea9094c76cd55f300791d66))
* **settings:** say a held deletion instead of offering to delete the project ([58a8e68](https://github.com/samuelcsantana/pyxis-web/commit/58a8e684b7f420e1915ae81d622e89f60bc91a57))
* **shell:** say on every project screen that its event reception is suspended ([b5c9ce8](https://github.com/samuelcsantana/pyxis-web/commit/b5c9ce8577015f129980b46d9f0d7bdf55b31de5))
* **welcome:** welcome back a subscription that is active again ([08b5d6f](https://github.com/samuelcsantana/pyxis-web/commit/08b5d6f46f0722aa07c00123bca046644d44276c))


### Refactoring

* **accounts:** read the operator fields as required ([496ac55](https://github.com/samuelcsantana/pyxis-web/commit/496ac55bf79854864ac2beec1cf349c0013e8d30))
* **projects:** read the second round of operator fields as required ([eabd7a9](https://github.com/samuelcsantana/pyxis-web/commit/eabd7a9c0a5fccfc4680845049b9105d09635df8))


### Documentation

* **readme:** describe subscribing again and the pause exemption ([856c101](https://github.com/samuelcsantana/pyxis-web/commit/856c101ca56157d4b77fa117833b6a7b802ca57d))
* **readme:** describe the suspended reception, the missing key and the held deletion ([a4dbeef](https://github.com/samuelcsantana/pyxis-web/commit/a4dbeef0dd93a7f9e62b63ea0867986d0e6a1fea))

## [0.20.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.19.0...v0.20.0) (2026-10-15)


### Features

* **account:** show a suspension and a held deletion on the account page ([31613f8](https://github.com/samuelcsantana/pyxis-web/commit/31613f8a3abae5908ddbc77662f5ddc3e0f3d341))
* **account:** warn across the dashboard when an account is suspended ([4c01d7f](https://github.com/samuelcsantana/pyxis-web/commit/4c01d7f662d2f2c4a889aabaf035ddd65de8bd8e))
* **settings:** explain a project kept while its account's deletion is held ([440b7da](https://github.com/samuelcsantana/pyxis-web/commit/440b7da44538626c6d9e53bd1e837b0cebe3981e))
* **shell:** explain a suspended account instead of failing the screen ([58fb543](https://github.com/samuelcsantana/pyxis-web/commit/58fb543aea46ddf64810c88243c715c062df7b9e))
* **sign-up:** say the free trial is one per customer ([590aac5](https://github.com/samuelcsantana/pyxis-web/commit/590aac5043a277745b42681a1b94c9c8a9833b4a))


### Bug Fixes

* **account:** keep the closing confirmation after the page refreshes ([2adf7e0](https://github.com/samuelcsantana/pyxis-web/commit/2adf7e0b2c9b93b9946ca159c008e62d01830f92))
* **account:** stop offering billing on an ended account ([0f7d538](https://github.com/samuelcsantana/pyxis-web/commit/0f7d5380140e605095110ae816dcd4f564094666))


### Documentation

* describe a suspended account, a held deletion and the one-trial rule ([51c1540](https://github.com/samuelcsantana/pyxis-web/commit/51c15402f6f569109041aa413d6b348ed97c1683))

## [0.19.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.18.1...v0.19.0) (2026-10-15)


### Features

* **account:** add the account and billing page, and warn in the dashboard ([fce5e1b](https://github.com/samuelcsantana/pyxis-web/commit/fce5e1b7daf3af292aa35f7d30aa7461746e0a0e))
* **account:** create a first project and follow it to its first event ([a7e379e](https://github.com/samuelcsantana/pyxis-web/commit/a7e379e3afc780eb8c907a0e89e568849a473251))
* **account:** export a project's events and close an account from the dashboard ([a44c1d8](https://github.com/samuelcsantana/pyxis-web/commit/a44c1d801b6a203a7712a544ebb35d8562b99d74))
* **landing:** serve llms.txt on the home page domain ([075e064](https://github.com/samuelcsantana/pyxis-web/commit/075e064ffb9324411fe4a4e1575d84787498cfa1))
* **services:** ask for a project's export and close an account ([73afc40](https://github.com/samuelcsantana/pyxis-web/commit/73afc406b4db27caf1e1fb1c01825d1401c4c53f))
* **services:** create a project in an account ([e94d5fd](https://github.com/samuelcsantana/pyxis-web/commit/e94d5fd90bd4780a44c215edf607948a9f5e6e90))
* **services:** keep the API's error code and patch through the writer ([553db9a](https://github.com/samuelcsantana/pyxis-web/commit/553db9a2b4216c2be1077119b4c0ce067ee93b0e))
* **services:** manage an owned project through the API ([fd9fca6](https://github.com/samuelcsantana/pyxis-web/commit/fd9fca67909cc4051e98580281c20f425c313900))
* **services:** post JSON bodies and template token routes in logs ([225a6af](https://github.com/samuelcsantana/pyxis-web/commit/225a6afae6bc4fae411e83ec2ea0513b1876d2a1))
* **services:** read and change the people of a project ([84cee3e](https://github.com/samuelcsantana/pyxis-web/commit/84cee3e95d5c6d346d031a9c6beb07af2cf19bd3))
* **services:** read the admin's accounts and open Stripe from them ([eff33f1](https://github.com/samuelcsantana/pyxis-web/commit/eff33f1dbbf0985c4dd465a5b31bbc8f244d0dd4))
* **services:** read whether sign-up is open and sign up with a code ([e026c14](https://github.com/samuelcsantana/pyxis-web/commit/e026c149237db1cdfe9777a4832c8a1a45fc5acc))
* **settings:** add the access tokens panel ([0ccc346](https://github.com/samuelcsantana/pyxis-web/commit/0ccc3469e544fda96770f1a760e6df793ef1bd13))
* **settings:** let the owner change a project, its keys and delete it ([73185f1](https://github.com/samuelcsantana/pyxis-web/commit/73185f1a819795929cdfbbe448e0e6a31b7a83b5))
* **settings:** list the people of a project and let the owner add and remove them ([43b0e72](https://github.com/samuelcsantana/pyxis-web/commit/43b0e72d71941eb9902b56ae328a17b5021eae6a))
* **settings:** read who may change a project from its settings ([65d70e7](https://github.com/samuelcsantana/pyxis-web/commit/65d70e770ccb39492b0d50345bf203693a0a3cf0))
* **settings:** read, create and revoke access tokens through the API ([61b9ebf](https://github.com/samuelcsantana/pyxis-web/commit/61b9ebf96b028d40701b64bccfb3783861933b16))
* **sign-up:** sign up with a plan, the terms and a code, then pay through Checkout ([70e4cbe](https://github.com/samuelcsantana/pyxis-web/commit/70e4cbe748a70cfa86d304c07f1d63cc9becb785))


### Bug Fixes

* **demo:** start the demo account's trial at its full length ([161236d](https://github.com/samuelcsantana/pyxis-web/commit/161236d4dfba5e958c7e984219dc436a28f21943))


### Refactoring

* **ui:** share the refresher that waits for pending work ([d81e73b](https://github.com/samuelcsantana/pyxis-web/commit/d81e73bdc8d39a074e340fc7dd57cfa8e21bde32))


### Documentation

* **readme:** describe creating a first project ([cb50256](https://github.com/samuelcsantana/pyxis-web/commit/cb50256a4a18544867a60c8b31c961da1337e689))
* **readme:** describe exports and closing an account ([fd54527](https://github.com/samuelcsantana/pyxis-web/commit/fd545278f463153d9e3d85a5a4db91e93462b71d))
* **readme:** describe the access tokens panel ([6f329e5](https://github.com/samuelcsantana/pyxis-web/commit/6f329e526e06b47acbc9dde01610ad4441234e4c))
* **readme:** describe the account and billing page ([068d70d](https://github.com/samuelcsantana/pyxis-web/commit/068d70db5da75ed2fa89ae7af3e869c066d54790))
* **readme:** describe the owner's project settings ([9cc7cc5](https://github.com/samuelcsantana/pyxis-web/commit/9cc7cc5a31a1ad665d3966bcbd89d85857b2d80e))
* **readme:** describe the people panel ([b102ddf](https://github.com/samuelcsantana/pyxis-web/commit/b102ddfbf10ae95f1d100712dc24e8cad81d7bdf))
* **readme:** describe the sign-up ([cce064d](https://github.com/samuelcsantana/pyxis-web/commit/cce064d8b465320e362f710a67d45351f8e20450))
* **readme:** mention llms.txt on the home page ([b059d10](https://github.com/samuelcsantana/pyxis-web/commit/b059d103540fc29dc98f233abaf150e0da2cddc3))

## [0.18.1](https://github.com/samuelcsantana/pyxis-web/compare/v0.18.0...v0.18.1) (2026-10-14)


### Bug Fixes

* **app:** answer the demo's missing manifest at request time ([c3511cd](https://github.com/samuelcsantana/pyxis-web/commit/c3511cdf3550eb87c044832f57be3216f966a6f9))
* **app:** give the installed dashboard a fixed identity ([42f2911](https://github.com/samuelcsantana/pyxis-web/commit/42f2911c0c3f9a056f6e4c799629cbcff311c5dd))
* **app:** offer the install only on the dashboard ([37b548a](https://github.com/samuelcsantana/pyxis-web/commit/37b548abbffe8ecf02ee609bd33555d7999bb538))


### Refactoring

* **app:** serve the web app manifest from a route handler ([f0f1976](https://github.com/samuelcsantana/pyxis-web/commit/f0f197646a4c6c8b6a1751b1e01c0f0000766f32))

## [0.18.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.17.0...v0.18.0) (2026-10-13)


### Features

* **i18n:** add the Spanish dictionary ([f5fd337](https://github.com/samuelcsantana/pyxis-web/commit/f5fd337f87e8a009bc4d5956824a74a3e733f213))
* **i18n:** ship the dashboard in Spanish ([8b86961](https://github.com/samuelcsantana/pyxis-web/commit/8b86961d27884909d6ab2a9e79ea40879731afe9))
* **landing:** serve the home page in Spanish at /es ([3599c1c](https://github.com/samuelcsantana/pyxis-web/commit/3599c1c3c5244a9ca6e4eaa9712983f7b1d1fb0a))


### Bug Fixes

* **landing:** keep the header on one row on a phone with three languages ([d07ae74](https://github.com/samuelcsantana/pyxis-web/commit/d07ae74a7b1e681973c838224f354a10ae666ee3))

## [0.17.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.16.0...v0.17.0) (2026-10-13)


### Features

* **demo:** link the demo banner to the page that explains Pyxis ([ce43e78](https://github.com/samuelcsantana/pyxis-web/commit/ce43e78f17166982d7e73748842a2a0490c9c155))
* **landing:** keep the recorder toggle off the first screen until the visitor scrolls ([fefe000](https://github.com/samuelcsantana/pyxis-web/commit/fefe0009f1c25d71cc7059d50d2313e99eb69668))
* **preferences:** carry the language and the theme between the Pyxis addresses ([47b5c26](https://github.com/samuelcsantana/pyxis-web/commit/47b5c26fc44dbf62303bbfc0c864a75e71d20e58))
* **sign-in:** wear the home page header on the sign-in page ([3b23db3](https://github.com/samuelcsantana/pyxis-web/commit/3b23db382261bcaca0f4b29e71f6441d9d210ff2))

## [0.16.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.15.0...v0.16.0) (2026-10-13)


### Features

* **i18n:** let a page's address name its language ([f62e7a5](https://github.com/samuelcsantana/pyxis-web/commit/f62e7a5926560b61849965ef24cb19557c169f0c))
* **landing:** engineering, architecture, comparison, FAQ and the post ([3914c80](https://github.com/samuelcsantana/pyxis-web/commit/3914c806416b1dd490a4d40aa1418b822275e3ad))
* **landing:** home page with its head, header, hero and footer ([47480dd](https://github.com/samuelcsantana/pyxis-web/commit/47480ddfb8b25fec66fbfa9641652d826fc34624))
* **landing:** motion on the home page, none when less is asked for ([831374b](https://github.com/samuelcsantana/pyxis-web/commit/831374b48637c3dcc11f85e272d14a349f8259bb))
* **landing:** route the main domain to the home page ([7222ac2](https://github.com/samuelcsantana/pyxis-web/commit/7222ac27030946b26107548e0581aa48769a66c0))
* **landing:** sections on privacy, the dashboard, installing and production use ([df8898d](https://github.com/samuelcsantana/pyxis-web/commit/df8898ddc5a811c3bdd8e1092cd10f2b09503709))
* **landing:** show the demo's Overview and checkable numbers in the hero ([78e8200](https://github.com/samuelcsantana/pyxis-web/commit/78e8200e39fc129bfd9cdf3a4c6d8f16b2b990ae))
* **landing:** the home page measures itself and shows what it recorded ([a86a5d3](https://github.com/samuelcsantana/pyxis-web/commit/a86a5d3093162a8726d429b35697260a2991e92d))
* **seo:** give each demo screen its canonical address ([44b0af9](https://github.com/samuelcsantana/pyxis-web/commit/44b0af99e2cbe405a39f2f25f876a489e1a16eb0))
* **seo:** give the main domain its own robots.txt and sitemap ([9590df6](https://github.com/samuelcsantana/pyxis-web/commit/9590df65575741440cfc3c469c47c306bceb1b5e))
* **seo:** publish a sitemap of the live demo ([53f78c8](https://github.com/samuelcsantana/pyxis-web/commit/53f78c8d752dd348c53be6f8ea7c50ad4ac30f90))


### Bug Fixes

* **landing:** find the main domain by the Host header ([88e3603](https://github.com/samuelcsantana/pyxis-web/commit/88e360349deac404e45bc7dfac80bb1f9078e11d))


### Documentation

* **readme:** describe the home page and how to try it locally ([a4fb887](https://github.com/samuelcsantana/pyxis-web/commit/a4fb8870977e879f0016ea6943c2ba3a5385902a))
* **readme:** link the introduction post ([049d01e](https://github.com/samuelcsantana/pyxis-web/commit/049d01efd061e9a39b06c6c5d9f9f41629c846ae))
* **readme:** re-record the screenshots with the visitor's state ([38c3b05](https://github.com/samuelcsantana/pyxis-web/commit/38c3b058fd715ea57067ed821ea1e9b9023e93ab))
* **readme:** record the tour again from the current demo ([0b9f4c7](https://github.com/samuelcsantana/pyxis-web/commit/0b9f4c79e99c7e729b8ded413050acef50bdce52))

## [0.15.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.14.0...v0.15.0) (2026-10-12)


### Features

* **devices:** list the regions of the visits on the Devices screen ([7b64cf4](https://github.com/samuelcsantana/pyxis-web/commit/7b64cf4d68ccbd0f48ddeeed006205d537c5dbfd))
* **devices:** read the visitor's region from the API ([c6c01ea](https://github.com/samuelcsantana/pyxis-web/commit/c6c01ea400ab358e87c873aff5af262770695d56))
* **timeline:** name the region of each visit in its card ([acebe1c](https://github.com/samuelcsantana/pyxis-web/commit/acebe1c3a52bc732c2999e3e1055f010b57aa956))
* **visits:** show the region of each visit and filter the list by it ([8d3f3ef](https://github.com/samuelcsantana/pyxis-web/commit/8d3f3efb6e8e8ef3652fec70a3a5d19ac4fef56d))


### Refactoring

* **i18n:** name the country formatter after what it formats ([73f9738](https://github.com/samuelcsantana/pyxis-web/commit/73f9738953d06009dbd60d3913da33632dc7f14a))


### Documentation

* **readme:** describe the regions on Devices, Visits and their files ([b4bfd6f](https://github.com/samuelcsantana/pyxis-web/commit/b4bfd6f86fe29a699326b2bc3fcbb111af9e7926))

## [0.14.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.13.0...v0.14.0) (2026-10-11)


### Features

* **app:** serve the project icon from the dashboard's own address ([c7d6ee6](https://github.com/samuelcsantana/pyxis-web/commit/c7d6ee65d36a3cef923148dc74f911cc5283a0b8))
* **brand:** add the cover backdrop and a raised card for standalone pages ([df461f5](https://github.com/samuelcsantana/pyxis-web/commit/df461f5d6ad1c48d1ab7aac0c842e00d418b7801))
* **domain:** read the version of each project's site icon ([abd02bb](https://github.com/samuelcsantana/pyxis-web/commit/abd02bb6b8dd9580eff3b5a1350ddc28c780859b))
* **language:** slide to the chosen language and bring the page in ([3470be9](https://github.com/samuelcsantana/pyxis-web/commit/3470be9d16cd1f2b1844cf0cbc400a857fc0fc14))
* **services:** read the icon of a project as bytes ([f568923](https://github.com/samuelcsantana/pyxis-web/commit/f568923cec934e323734a1b38cdda71fffb1ba35))
* **shell:** show the icon of each project's site in the switcher ([0097e86](https://github.com/samuelcsantana/pyxis-web/commit/0097e86257a14a4a57fb2b3bd452016a85da6184))
* **sign-in:** draw the cover backdrop and raise the card ([99c4cb3](https://github.com/samuelcsantana/pyxis-web/commit/99c4cb3ba859cefa8ed12dbb5a249fc7b3b897b2))
* **sign-in:** explain empty and incomplete fields in the page's language ([076fb43](https://github.com/samuelcsantana/pyxis-web/commit/076fb43e5178f5eb25f547b36723d7710cb186d7))
* **sign-in:** fill the demo code from the demo hint ([2d6e94c](https://github.com/samuelcsantana/pyxis-web/commit/2d6e94cc7af1e75ea5c4f5f14133a69d7fa2b12a))
* **sign-in:** keep a refused code selected for retyping ([03f52fd](https://github.com/samuelcsantana/pyxis-web/commit/03f52fdf76136383bb2561d1fbce90a6f9b4fa04))
* **sign-in:** keep the code step through a reload of the tab ([dee6c01](https://github.com/samuelcsantana/pyxis-web/commit/dee6c0113c5bb6ae0af02e619af2a61bc49ccc16))
* **sign-in:** name Pyxis once, in the header ([e12effb](https://github.com/samuelcsantana/pyxis-web/commit/e12effb00a6c7dc7361bfdd0c72772fbe6a10270))
* **sign-in:** offer the live demo to visitors without access ([fdea3e7](https://github.com/samuelcsantana/pyxis-web/commit/fdea3e7f6acd43a33ab3f1a05faf5a9873d597c8))
* **sign-in:** show errors right under their field ([f2bb78d](https://github.com/samuelcsantana/pyxis-web/commit/f2bb78d098949fa0b891a53b567ae61d648075bf))
* **sign-in:** show the address above the code, with a Change button ([8e31132](https://github.com/samuelcsantana/pyxis-web/commit/8e311327f60e1edfdd8f1be6c2622719936b3f3b))
* **sign-in:** show the code in six cells over one field ([f4e3ed2](https://github.com/samuelcsantana/pyxis-web/commit/f4e3ed22eb662746c26631530a04e0cc3545d9bf))
* **sign-in:** verify the code as soon as the sixth digit is in ([dd942ba](https://github.com/samuelcsantana/pyxis-web/commit/dd942bab18019aeded90a4fc761f17427f0e1055))
* **sign-in:** wait 30 seconds before another code can be asked for ([151666f](https://github.com/samuelcsantana/pyxis-web/commit/151666f08b00d49f57aaa8e78d2688dc965501e4))
* **states:** draw the cover backdrop behind the standalone pages ([dd6f6f8](https://github.com/samuelcsantana/pyxis-web/commit/dd6f6f89ce6efe5e94043ffe23761467485b70c1))


### Bug Fixes

* **brand:** load the backdrop masks next to the stylesheet ([6b13531](https://github.com/samuelcsantana/pyxis-web/commit/6b1353104090b2a1539d02febe54529895bc001e))
* **sign-in:** keep every digit of a pasted code ([2ecb50d](https://github.com/samuelcsantana/pyxis-web/commit/2ecb50db971a6b3521d55f7817cddb58d752a4d0))


### Refactoring

* **shell:** move the main content id into its own module ([9cb24ea](https://github.com/samuelcsantana/pyxis-web/commit/9cb24ea3fd210ed5f66dc57044d4db3e538bb5dc))
* **states:** move the error boundary texts out of the error screen ([1dfd108](https://github.com/samuelcsantana/pyxis-web/commit/1dfd108e3f97a1752f6c9fb3738993e397606fe1))


### Documentation

* **readme:** describe the sign-in code cells and automatic verification ([4caa95b](https://github.com/samuelcsantana/pyxis-web/commit/4caa95bf3bad0dd9eceb3a6f9c037b5f5958064b))
* **readme:** describe the sign-in header, the demo link and the demo code button ([92538c4](https://github.com/samuelcsantana/pyxis-web/commit/92538c4892f52eae369e5ff9750480447b42e260))
* **readme:** describe the sign-in resend wait, address and reload ([04e0cdd](https://github.com/samuelcsantana/pyxis-web/commit/04e0cddaef52d464d2708d35cb311163942448cf))
* **readme:** mention the backdrop shared by the standalone pages ([2d4b716](https://github.com/samuelcsantana/pyxis-web/commit/2d4b7164904f9f4f020f3a92829b8811a25a3e55))
* **readme:** mention the sign-in messages in the page's language ([c43d4b7](https://github.com/samuelcsantana/pyxis-web/commit/c43d4b7f83ab68ddab990878de43d2bc2d5da121))

## [0.13.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.12.0...v0.13.0) (2026-10-10)


### Features

* **auth:** sign out of every device from the account menu ([37b6627](https://github.com/samuelcsantana/pyxis-web/commit/37b66274af4c11daf175e5fc34520e8872468cf9))
* **settings:** list the sessions of the admin and end one from its row ([0e39182](https://github.com/samuelcsantana/pyxis-web/commit/0e3918297e95b4659a9f42607112188416d88543))

## [0.12.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.11.0...v0.12.0) (2026-10-10)


### Features

* **auth:** keep the session in a host-only cookie set by a Server Action ([a4f001f](https://github.com/samuelcsantana/pyxis-web/commit/a4f001fbc1d183349816adc214e8adfafbd47a36))
* **security:** allow scripts by a per-request nonce instead of unsafe-inline ([614cac7](https://github.com/samuelcsantana/pyxis-web/commit/614cac7b094c766206c1dbc5b25b99048a8aebef))


### Documentation

* **adr:** record the host-only session cookie ([a84dd95](https://github.com/samuelcsantana/pyxis-web/commit/a84dd950c7f2c400a6e0a261f6dc1b8b6d87dfd3))
* **adr:** record the nonce-based Content Security Policy ([32acbfa](https://github.com/samuelcsantana/pyxis-web/commit/32acbfa7b2ea70171b0699d7f56d6f5d52060501))
* **readme:** point the links at pyxis-analytics.dev ([45f3a2c](https://github.com/samuelcsantana/pyxis-web/commit/45f3a2cbb5d19ff3fc29f64e2c69b8a06e8fc6e4))
* **readme:** state the production status ([ac7c93e](https://github.com/samuelcsantana/pyxis-web/commit/ac7c93e850491eb594596d789590bcf2a19ec00e))

## [0.11.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.10.0...v0.11.0) (2026-10-09)


### Features

* **visits:** list the applied filters above the visits, each removable ([119f712](https://github.com/samuelcsantana/pyxis-web/commit/119f712b4ce8c17a4d352fc714833f50d849d412))
* **visits:** tell when the filters form holds changes not applied yet ([c30dce1](https://github.com/samuelcsantana/pyxis-web/commit/c30dce1eb96e3aaaac5cfce8f5ee6010b2d139d8))

## [0.10.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.9.1...v0.10.0) (2026-10-09)


### Features

* **ui:** fade in the content a switch or a tab brings ([6629afa](https://github.com/samuelcsantana/pyxis-web/commit/6629afa909dc7479c747025c332f2ca7a9975a0b))
* **ui:** open select lists on the dashboard's own surface ([17c3cd9](https://github.com/samuelcsantana/pyxis-web/commit/17c3cd930c6cd0724b579cb00c5643f40faf5e19))
* **ui:** slide the fill of a switch to the chosen option ([c7f0948](https://github.com/samuelcsantana/pyxis-web/commit/c7f09486f8e0b13a18a5601bf7c0fe82307c176e))
* **ui:** slide the underline of the tabs to the chosen tab ([81bed69](https://github.com/samuelcsantana/pyxis-web/commit/81bed69cf623f888a180a0d08b55a06790241fa9))


### Bug Fixes

* **ui:** draw focus rings in their color from the first frame ([1109e90](https://github.com/samuelcsantana/pyxis-web/commit/1109e90a2c2ba6e4d013b67849b3115246733d2a))
* **ui:** end a long select option with an ellipsis before its chevron ([12f9944](https://github.com/samuelcsantana/pyxis-web/commit/12f99440f6895102754edc49d49ae7f0ebbdaa7a))
* **ui:** place a switch's fill only once the switch is drawn ([a19b950](https://github.com/samuelcsantana/pyxis-web/commit/a19b9504d8db14b9275ea0fddd3a5ea836bc67d5))


### Refactoring

* **ui:** share the period presets' click-ahead choice as a hook ([984a224](https://github.com/samuelcsantana/pyxis-web/commit/984a2244cce4bc79d2d2961547e12080fec13357))

## [0.9.1](https://github.com/samuelcsantana/pyxis-web/compare/v0.9.0...v0.9.1) (2026-10-09)


### Bug Fixes

* **shell:** keep the header in view on a desktop while the page scrolls ([c33aecb](https://github.com/samuelcsantana/pyxis-web/commit/c33aecbd1f06ebd31b2910c1103a9b439b3a7260))
* **shell:** keep the header's width on a desktop, long screen or short ([e007374](https://github.com/samuelcsantana/pyxis-web/commit/e007374798bfa38ba6655ac4ac1b4504d364c46a))

## [0.9.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.8.1...v0.9.0) (2026-10-09)


### Features

* **i18n:** name calendar months and days in full in each language ([d8b92e3](https://github.com/samuelcsantana/pyxis-web/commit/d8b92e34079305dd9c75db2b4709dc8399809c48))
* **period:** pick a date range on a calendar, as pure rules ([de67757](https://github.com/samuelcsantana/pyxis-web/commit/de677574c5b9c46f44fc53541dfe9afa5d3e4da0))
* **shell:** choose a custom period on a calendar ([278a189](https://github.com/samuelcsantana/pyxis-web/commit/278a1891bd1512c1c77f128a3e578adb6dc44f0b))
* **shell:** move settings into the navigation and preferences into an account menu ([306cfb3](https://github.com/samuelcsantana/pyxis-web/commit/306cfb31e70bd02e4ae518d69776d4816f0b838b))

## [0.8.1](https://github.com/samuelcsantana/pyxis-web/compare/v0.8.0...v0.8.1) (2026-10-09)


### Bug Fixes

* **devices:** put every breakdown table under its donut ([d76ba5b](https://github.com/samuelcsantana/pyxis-web/commit/d76ba5b8a8c4009347710895cdab333bc999aebc))
* **forms:** hug fields with their focus ring and align the selects ([3d1ad7e](https://github.com/samuelcsantana/pyxis-web/commit/3d1ad7e87952a03c6d9f86a04adf902c7ad4757f))
* **shell:** keep the header still when the period changes ([9bbeb6a](https://github.com/samuelcsantana/pyxis-web/commit/9bbeb6aa6a6c8e9dbdbb612c988a5f87c0afdc32))
* **shell:** keep the language menu inside the window ([5eb1ba0](https://github.com/samuelcsantana/pyxis-web/commit/5eb1ba0d0ee7b8ba2608a2e64290b03f09c4cc8f))

## [0.8.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.7.0...v0.8.0) (2026-10-09)


### Features

* **services:** write to the API with the admin's session ([0f9480b](https://github.com/samuelcsantana/pyxis-web/commit/0f9480b6cb674c9e149cb7a082a7c8e077c1de24))
* **settings:** read and choose the e-mail preferences through a service ([97cf910](https://github.com/samuelcsantana/pyxis-web/commit/97cf910a51c8b7c5f6599281ffa0caa83026458a))
* **settings:** turn the weekly digest on or off in Settings ([b51f9b1](https://github.com/samuelcsantana/pyxis-web/commit/b51f9b1c3474ef00f3e9a34889cc05ca36adee04))


### Documentation

* **readme:** describe the weekly digest switch in Settings ([ef93f4e](https://github.com/samuelcsantana/pyxis-web/commit/ef93f4ee820280b0b068b1d2d72e75379a88faa9))

## [0.7.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.6.0...v0.7.0) (2026-10-09)


### Features

* **features:** read how the visits of a period entered, left and lasted ([d9dcea9](https://github.com/samuelcsantana/pyxis-web/commit/d9dcea9b402d19b512ac401289a7ca11dd06379b))
* **features:** show where visits start and end and how long they last ([1740de4](https://github.com/samuelcsantana/pyxis-web/commit/1740de48ccb114c32ba4684779480059ec28f4ac))
* **funnel:** read the funnel per device type or channel of the visit ([9f73f08](https://github.com/samuelcsantana/pyxis-web/commit/9f73f0805e618cc07b99b18be9081c2c9274ebff))
* **funnel:** split the per-visit funnel by device or channel ([c25b647](https://github.com/samuelcsantana/pyxis-web/commit/c25b6471321df6b65b507a6820e32fde6a3bc6b8))
* **i18n:** name the weekdays in each language ([f56d068](https://github.com/samuelcsantana/pyxis-web/commit/f56d0684aa5e36cc83cfe5d96459d2cb9f5a1e37))
* **overview:** read when the visits of a period started ([033e802](https://github.com/samuelcsantana/pyxis-web/commit/033e8021cf42b2ad3970279273d5fd70ee8c504f))
* **overview:** show when visits start, by weekday and hour ([452e310](https://github.com/samuelcsantana/pyxis-web/commit/452e310d69540596b093e02a4bdffc703fa86669))
* **projects:** read the settings of a project from the API and the demo ([3f5a44f](https://github.com/samuelcsantana/pyxis-web/commit/3f5a44f7c2d91c404414944714aef91abc30a611))
* **settings:** open the settings of a project from a gear beside it ([dc5d698](https://github.com/samuelcsantana/pyxis-web/commit/dc5d698dc0e07fc99812c003176ea3e4a1ea4d7e))
* **settings:** show how a project is set up, read-only ([00aceb6](https://github.com/samuelcsantana/pyxis-web/commit/00aceb65edde5f33ae2e1b55a57457faf5d26bfc))


### Bug Fixes

* **settings:** keep the desktop gear in the brand row ([b8271f4](https://github.com/samuelcsantana/pyxis-web/commit/b8271f4f0026ed292ec61c90f130e2bed08968a2))


### Documentation

* **readme:** describe the entry, exit and visit length panels ([fff3f51](https://github.com/samuelcsantana/pyxis-web/commit/fff3f5105e549f67ae7ce9c30cc739e595466325))
* **readme:** describe the funnel split by device or channel ([bbdb7d2](https://github.com/samuelcsantana/pyxis-web/commit/bbdb7d2df3d754e74520ed85539340b44b63afe1))
* **readme:** describe the read-only Settings page ([5ab488f](https://github.com/samuelcsantana/pyxis-web/commit/5ab488feaad4a59c8abf12274cc099717e658a66))
* **readme:** describe the When visits start panel ([6fab3e5](https://github.com/samuelcsantana/pyxis-web/commit/6fab3e58eda3bde264c3607b1dbb647a3730a228))

## [0.6.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.5.0...v0.6.0) (2026-10-09)


### Features

* **acquisition:** download the campaigns as a CSV file ([c449558](https://github.com/samuelcsantana/pyxis-web/commit/c4495586b51ee66468540789ea56c2b7bfb98a3e))
* **acquisition:** list the campaigns, each opening its visits from its source ([db84f4b](https://github.com/samuelcsantana/pyxis-web/commit/db84f4b7da7e22e966afea98b1402177350a96d2))
* **acquisition:** read the campaigns the API ranks ([b1cb410](https://github.com/samuelcsantana/pyxis-web/commit/b1cb410c22b71ab9944c886ee50b90a355636fb2))
* **demo:** add seeded random helpers for the demo data ([d93ff32](https://github.com/samuelcsantana/pyxis-web/commit/d93ff32804f105c938e86976648434039e68d6a1))
* **demo:** draw every visit of a demo day from the project catalog ([135321e](https://github.com/samuelcsantana/pyxis-web/commit/135321e6307ead5ff5e8dbb8f673c9a42d918371))
* **funnel:** list who reached or left each step, from links on its figures ([98a3a39](https://github.com/samuelcsantana/pyxis-web/commit/98a3a397c32521d5406c5089cf9521a11a13f22e))
* **funnel:** read the median time of each step and of the whole funnel ([3e3f0e0](https://github.com/samuelcsantana/pyxis-web/commit/3e3f0e04500a188364199355fbda9276dffbd93b))
* **funnel:** read who reached or left a step from the API and the demo ([d49887e](https://github.com/samuelcsantana/pyxis-web/commit/d49887e59fa3c023a2b6c4216b29489c93ef68fc))
* **funnel:** show how long each step took and the time to finish ([fc44fc0](https://github.com/samuelcsantana/pyxis-web/commit/fc44fc0079f162e121f7b6efae1b3541f398abaa))
* **i18n:** fill the elements inside a message with rich() ([adc30d9](https://github.com/samuelcsantana/pyxis-web/commit/adc30d91aca7e67ac5cfabf13962de8a5f08e855))
* **i18n:** give the domain the formats and translator of the request ([ff7d957](https://github.com/samuelcsantana/pyxis-web/commit/ff7d957cdc535d19118bc0189850b43ed6c592ca))
* **i18n:** join lists the way each language does ([8104d8e](https://github.com/samuelcsantana/pyxis-web/commit/8104d8e3d15c157a150fbc9166761d568aafa500))
* **i18n:** let the reader choose the interface language ([0cbc2a6](https://github.com/samuelcsantana/pyxis-web/commit/0cbc2a6bf8513cba80c4d66a645bca188e0dc1d8))
* **i18n:** ship the dashboard in Brazilian Portuguese ([bf391d5](https://github.com/samuelcsantana/pyxis-web/commit/bf391d51a4533c045f15f9e8418a81c00cff5f64))
* open the visits of a source, a country and a failing route ([3b1cac5](https://github.com/samuelcsantana/pyxis-web/commit/3b1cac5d6c8f6a213d6ee70e7eb779d255d06f0e))
* **requests:** ask the days of one route from the API and the demo ([7e57acf](https://github.com/samuelcsantana/pyxis-web/commit/7e57acf9f07424b3637522840927361818b7a301))
* **requests:** chart the failures of each day by what went wrong ([4a908cc](https://github.com/samuelcsantana/pyxis-web/commit/4a908cce7bd36cea67d8e65f22d6e9e82c8246bb))
* **requests:** list the days of a route in its details panel ([fce4cab](https://github.com/samuelcsantana/pyxis-web/commit/fce4cab5ed12ab76f27d63e70d6821fff5f4d97d))
* **requests:** read the days of one route and shape them for its details ([9e72aa4](https://github.com/samuelcsantana/pyxis-web/commit/9e72aa4defe6d5c159cfaa3183d7e164cefc8c48))
* **requests:** read the p95 and the failures per day the API reports ([c33d476](https://github.com/samuelcsantana/pyxis-web/commit/c33d476f1f180f70284e72db54c997cf000cd08b))
* **requests:** show the p95 of each route beside its median ([0719f66](https://github.com/samuelcsantana/pyxis-web/commit/0719f66280d68a06c00649271f5f7c2d1d15f414))
* **sign-in:** ask for the sign-in email in the reader's language ([fe755d6](https://github.com/samuelcsantana/pyxis-web/commit/fe755d601ce83f13c59fefcce87772838ce7a714))
* **theme:** add a rem type scale to the design tokens ([a555456](https://github.com/samuelcsantana/pyxis-web/commit/a5554561c4afcefb16ef65b4288cdbf7373ffec0))
* **timeline:** link a visit opened by its id to every visit of its person ([164b640](https://github.com/samuelcsantana/pyxis-web/commit/164b64014c3a01d8d0aea4c3bc6bb324565b6436))
* **timeline:** read the person each visit was identified as ([dfccd24](https://github.com/samuelcsantana/pyxis-web/commit/dfccd2469e656ebd55c043311238afe112f29a9d))
* **visits:** filter by country, source, campaign and a failed request ([8d53c99](https://github.com/samuelcsantana/pyxis-web/commit/8d53c997ff597a4023e2b2af02e759fd4266ff1d))


### Bug Fixes

* **layout:** keep every screen inside the window at large text sizes ([9a01350](https://github.com/samuelcsantana/pyxis-web/commit/9a01350044921d7d705795364c292630422786e2))
* **overview:** mark the pressed KPI card and the screen busy like any link ([f2dac56](https://github.com/samuelcsantana/pyxis-web/commit/f2dac56e1d24aca1ef377a118830413bb7b77087))
* **requests:** list only the screens where a route failed ([338e5fd](https://github.com/samuelcsantana/pyxis-web/commit/338e5fd05be833af0024a07cb469137da809c8ca))
* **visits:** give the account link of a visit a 24px target ([8e4e351](https://github.com/samuelcsantana/pyxis-web/commit/8e4e351511c4be538feb0d01526e0f8318edf4d4))
* **visits:** give the Visits CSV export its own 60-second limit ([ea4e497](https://github.com/samuelcsantana/pyxis-web/commit/ea4e497635e80de822d75dc7ff57742b9dfe30a9))


### Refactoring

* **acquisition:** read the Acquisition text from the dictionary ([ef86baa](https://github.com/samuelcsantana/pyxis-web/commit/ef86baac8a949e7de2c452b184288327c4ce4401))
* **acquisition:** share the conversion figures and columns of a ranking ([2a469fd](https://github.com/samuelcsantana/pyxis-web/commit/2a469fd2ef1c337f44cd84a84cbc7d1c9361f79f))
* **app:** read the title shared by the demo from the dictionary ([883c73a](https://github.com/samuelcsantana/pyxis-web/commit/883c73a113e48a3a151736b54335082a4a380779))
* **charts:** read the Chart and Table switch from the dictionary ([09a0d9b](https://github.com/samuelcsantana/pyxis-web/commit/09a0d9b742d5f3e8a07ade0598f5b4c931c6bc8b))
* **demo:** delete the statistical model the screens no longer read ([2a4ed4a](https://github.com/samuelcsantana/pyxis-web/commit/2a4ed4ad9bc87a836b7174d8b4c62a58f72ecbc2))
* **demo:** reduce every demo screen from the drawn visits ([ca7d361](https://github.com/samuelcsantana/pyxis-web/commit/ca7d361ce7ccbc7cdd9c1dbeeeea62aa668c4aa2))
* **devices:** delete the share summary that nothing renders ([6ab2ca2](https://github.com/samuelcsantana/pyxis-web/commit/6ab2ca2cd74924322689a3b30d97cafe855762ba))
* **devices:** read the Devices text from the dictionary ([5de4a24](https://github.com/samuelcsantana/pyxis-web/commit/5de4a24be5bcb729eff6c9a427dd85e064b742b5))
* **domain:** format and count through the request language ([6a7f49e](https://github.com/samuelcsantana/pyxis-web/commit/6a7f49e0ecd183f8753ec591c4b10291f53202e9))
* **features:** read the Features text from the dictionary ([ab1f143](https://github.com/samuelcsantana/pyxis-web/commit/ab1f143654ed193cf9546219a6919a23f717535e))
* **funnel:** read the funnel editor text from the dictionary ([707cd48](https://github.com/samuelcsantana/pyxis-web/commit/707cd48f13f105780fc0d2775dc8399369e62b2c))
* **funnel:** read the Funnel page text from the dictionary ([62880b1](https://github.com/samuelcsantana/pyxis-web/commit/62880b128e406cdcfc77fcd1d435e1f947e3b4bf))
* **i18n:** read the Acquisition, Devices and Requests text from the dictionary ([f0c4a1e](https://github.com/samuelcsantana/pyxis-web/commit/f0c4a1ea760a75336578d57e3768b541fa2bdea0))
* **i18n:** read the Funnel, Visits and Timeline text and the problems from the dictionary ([561476b](https://github.com/samuelcsantana/pyxis-web/commit/561476bc5966eccb965e1a6af8439f9e7cbb8317))
* **i18n:** read the Overview, period and glossary text from the dictionary ([8b9f0f6](https://github.com/samuelcsantana/pyxis-web/commit/8b9f0f64d541b6ac886686e7e1b489f5346c9fa6))
* **i18n:** read the Requests text from the dictionary ([4a13160](https://github.com/samuelcsantana/pyxis-web/commit/4a13160e4223042023a2ca4dfdcfc71943f31086))
* **i18n:** read the Timeline text from the dictionary ([6146dda](https://github.com/samuelcsantana/pyxis-web/commit/6146dda597f6671107870736d143aa32b5dd38d4))
* **i18n:** read the Visits text from the dictionary ([d6ef73e](https://github.com/samuelcsantana/pyxis-web/commit/d6ef73e91d637e483b58e2fe46927b64d5ef7707))
* **overview:** read the Overview text from the dictionary ([91a7678](https://github.com/samuelcsantana/pyxis-web/commit/91a7678513f7a1efd35707a62de2ecb9a2299c1f))
* **shell:** read the navigation and account text from the dictionary ([5a51f40](https://github.com/samuelcsantana/pyxis-web/commit/5a51f403dbcfc097131af9b6e41c63195667951f))
* **shell:** read the period selector text from the dictionary ([af9828f](https://github.com/samuelcsantana/pyxis-web/commit/af9828f991ecd9336db038ac409e23c04dd9cf75))
* **shell:** read the screen names from the dictionary ([745d182](https://github.com/samuelcsantana/pyxis-web/commit/745d18204543e7d60be7b1b86e022aec727e4208))
* **sign-in:** read the sign-in form and page from the dictionary ([026cc26](https://github.com/samuelcsantana/pyxis-web/commit/026cc266ab7fd4634ed61cbd0934bbcb14083a2d))
* **states:** read the empty, first-run and demo text from the dictionary ([aa3b78e](https://github.com/samuelcsantana/pyxis-web/commit/aa3b78e5d2494d1fd8a41bb12d2d5c1abe0d2c17))
* **states:** read the error panels from the dictionary ([0fddbb2](https://github.com/samuelcsantana/pyxis-web/commit/0fddbb28cb572cdd3d140b7fe130f70eb3cd3677))
* **states:** read the not-found pages from the dictionary ([09e9b75](https://github.com/samuelcsantana/pyxis-web/commit/09e9b7510541812a3f74d6b3d18522fdec702cf3))
* **theme:** name the theme toggle with whole sentences ([7d1e9fb](https://github.com/samuelcsantana/pyxis-web/commit/7d1e9fb0bdd89a79dd1366c15476daef86ae60da))
* **timeline:** name the formatting of a number of seconds ([3e4c266](https://github.com/samuelcsantana/pyxis-web/commit/3e4c266d3bd89c6d43c57b9bc0a52b3624f7542c))
* **ui:** make every visits link say its purpose from the dictionary ([81cdc3c](https://github.com/samuelcsantana/pyxis-web/commit/81cdc3c18a57ac0458bb19d3459750c4e5584c8c))
* **ui:** read the CSV download text from the dictionary ([7ecc1a9](https://github.com/samuelcsantana/pyxis-web/commit/7ecc1a937f7fe0ca03f21af74598fcc869bc6437))
* **ui:** size every text with the rem type tokens ([d64f34e](https://github.com/samuelcsantana/pyxis-web/commit/d64f34e4ad68ad9223be9f277077f6ae36808181))
* **visits:** read the filter placeholders from the dictionary ([41cebcb](https://github.com/samuelcsantana/pyxis-web/commit/41cebcb83605eff65b958233f55479f89f04098b))


### Documentation

* describe the interface languages and record the pt-BR glossary ([af1571e](https://github.com/samuelcsantana/pyxis-web/commit/af1571e6872f2d0243d11a706937361da290bf70))
* **readme:** describe text that follows the reader's text size ([326206f](https://github.com/samuelcsantana/pyxis-web/commit/326206f0281fe575d8828ed935d4ccdfafda048e))
* **readme:** describe the campaigns of Acquisition ([0f1c5c9](https://github.com/samuelcsantana/pyxis-web/commit/0f1c5c9c4a69957793d4e04d24d75cda5e518ce6))
* **readme:** describe the day by day of a route in the Requests details ([347a88a](https://github.com/samuelcsantana/pyxis-web/commit/347a88adc6e8a4bdf898dd0d066eb19b678e5758))
* **readme:** describe the failures per day and the p95 of Requests ([bb2ffaf](https://github.com/samuelcsantana/pyxis-web/commit/bb2ffaf8453eeb103db160a66363452f1e5be700))
* **readme:** describe the step times of the Funnel ([d4b607b](https://github.com/samuelcsantana/pyxis-web/commit/d4b607bd4661aa4f9922ccc133e596bd6f6592f0))
* **readme:** list rich() among the interface language helpers ([d6c05a7](https://github.com/samuelcsantana/pyxis-web/commit/d6c05a71d23ec5a76e4b7d72e3517e0b68b912fc))
* **readme:** re-record the tour and the screenshots from the current demo ([ce28adf](https://github.com/samuelcsantana/pyxis-web/commit/ce28adf9aa48b0abf977be789ce8ceb8cfacb0b4))
* **readme:** say a lint rule keeps interface text in the dictionary ([1d34c0a](https://github.com/samuelcsantana/pyxis-web/commit/1d34c0ac75592423f9782b2fb88c1d9eae817ea6))
* **readme:** say each funnel figure lists who reached or left the step ([88c6cfa](https://github.com/samuelcsantana/pyxis-web/commit/88c6cfa9806f2312471ca36cd188dc5e7997221b))
* **readme:** say how Client Components that only show words get them from the server ([5bb50f7](https://github.com/samuelcsantana/pyxis-web/commit/5bb50f7621c05819778fd8a9e4f95f158e72c4b9))
* **readme:** say how tests render the Client Components that read the dictionary ([01212af](https://github.com/samuelcsantana/pyxis-web/commit/01212af1a9a3d51368a2de9bb67d26f76f974b12))
* **readme:** say how the domain gets the language of a request ([c6b8e98](https://github.com/samuelcsantana/pyxis-web/commit/c6b8e984a61b0bed9743a2e5b75460b814a3a77f))
* **readme:** say the demo screens reduce one set of drawn visits ([acc8b98](https://github.com/samuelcsantana/pyxis-web/commit/acc8b98f5536bf68e5332b7b94c0f5aa372be325))
* **readme:** say the KPI cards take part in the navigation feedback ([8c66cc8](https://github.com/samuelcsantana/pyxis-web/commit/8c66cc84737628e3fc971470f63ccef06e68b91b))
* **readme:** say the sign-in email follows the reader's language ([d6ec93d](https://github.com/samuelcsantana/pyxis-web/commit/d6ec93d170d9617c0e1abc905bef78d16790e796))
* **readme:** say the Visits export sets its own time limit ([e4cc9af](https://github.com/samuelcsantana/pyxis-web/commit/e4cc9af58a2067f9fc637bee575a13e0f24dd4fb))
* **storybook:** switch the stories' language from the toolbar ([91d9f0e](https://github.com/samuelcsantana/pyxis-web/commit/91d9f0e6e8c5950dd045eb92526e33b3c37d09bc))

## [0.5.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.4.0...v0.5.0) (2026-10-08)


### Features

* **acquisition:** download the sources and visits by channel as CSV ([3cab7ce](https://github.com/samuelcsantana/pyxis-web/commit/3cab7cea6f52e90ad972dcb0af50b43a49b764f1))
* **acquisition:** link the channel of each source to its visits ([cc98f68](https://github.com/samuelcsantana/pyxis-web/commit/cc98f68ed4719bbfe1f759f81184df201a2a17bc))
* **app:** render each page in the language of the request ([558c64e](https://github.com/samuelcsantana/pyxis-web/commit/558c64e11bec93acac45172d9677af54e8ecf101))
* **charts:** show the values of the day under the pointer ([fc2996f](https://github.com/samuelcsantana/pyxis-web/commit/fc2996f63388d4171462cdee9a6594403a6445a0))
* **demo:** give every ranked page, event and value a demo visit ([ddd2003](https://github.com/samuelcsantana/pyxis-web/commit/ddd200311b57e0573be23ca935509a4c08b15b4b))
* **devices:** download every Devices breakdown as one CSV file ([6be4315](https://github.com/samuelcsantana/pyxis-web/commit/6be431593e29d5ed0b6c3d599f8e0ef6c1751708))
* **devices:** link each device type to its visits ([5901b4e](https://github.com/samuelcsantana/pyxis-web/commit/5901b4e8d900b45a31538f4e6f903e4fb9368af2))
* **domain:** write tables as CSV files a spreadsheet cannot run ([00c0aef](https://github.com/samuelcsantana/pyxis-web/commit/00c0aef9f5b39928b90430e7ce0db05fbcdb2026))
* **features:** download the Features ranking as a CSV file ([c1aeb0e](https://github.com/samuelcsantana/pyxis-web/commit/c1aeb0ea70631c3280b18403e22ae27466f2a989))
* **features:** link every event, screen and property value to its visits ([09886a6](https://github.com/samuelcsantana/pyxis-web/commit/09886a6d192290983df60d8b2be70225ccedd33f))
* **forms:** submit the filter and search forms in place ([1f58eb7](https://github.com/samuelcsantana/pyxis-web/commit/1f58eb7ab6e0be8783f2423526b98a029c6d4bf3))
* **i18n:** list the interface languages and negotiate Accept-Language ([40170b0](https://github.com/samuelcsantana/pyxis-web/commit/40170b0cdc47690e64e24e4843dd23c56c6373bd))
* **i18n:** load the dictionary of the request and provide it to client components ([246a7ca](https://github.com/samuelcsantana/pyxis-web/commit/246a7cae3fecb40d82255ea47ebeecbd7fdfa4da))
* **i18n:** resolve the interface language of each request ([680a89d](https://github.com/samuelcsantana/pyxis-web/commit/680a89d2cf293f53731c5634343a6e994eacd71a))
* **i18n:** translate typed dictionary messages with CLDR plurals ([a07c942](https://github.com/samuelcsantana/pyxis-web/commit/a07c942d04811752cb226b03c9e18fa9e40942ce))
* **navigation:** mark the clicked period, tab, filter and screen link ([4c7ab24](https://github.com/samuelcsantana/pyxis-web/commit/4c7ab24630beb824de7eda2f04d3878dad83f78b))
* **overview:** download the Overview tables as CSV files ([f85ec0a](https://github.com/samuelcsantana/pyxis-web/commit/f85ec0a2aed11a7dd35b6a8f4d9aabac69be994f))
* **overview:** draw the daily activity as lines without fill ([4c60fb3](https://github.com/samuelcsantana/pyxis-web/commit/4c60fb31817fc9a010d069e4c5bd094a78306adf))
* **overview:** draw the previous period as a dashed line ([094f046](https://github.com/samuelcsantana/pyxis-web/commit/094f046cb920eb410077fc93e8107c6c7d8beb1b))
* **overview:** let a KPI card pick the figure the chart plots ([d1cac07](https://github.com/samuelcsantana/pyxis-web/commit/d1cac07afa71da65ccae2c2eddebdee0d6a8f094))
* **overview:** link each KPI card to the list behind its figure ([9f3fa67](https://github.com/samuelcsantana/pyxis-web/commit/9f3fa673f006ad4129f00227266eaa9402e63140))
* **requests:** download the Requests routes as CSV files ([95b4261](https://github.com/samuelcsantana/pyxis-web/commit/95b426130bff329dd1e7aefcc1052a03576b4a4a))
* **shell:** give the period controls 44px targets on phones ([c409096](https://github.com/samuelcsantana/pyxis-web/commit/c409096bfae123db4c611c7aaae562295afafa91))
* **shell:** mark the screen busy while a navigation is pending ([f484798](https://github.com/samuelcsantana/pyxis-web/commit/f48479867e8acbd94d4558e5c787d2b0841f39b0))
* **shell:** put the theme toggle in the phone menu bar ([13c6b5b](https://github.com/samuelcsantana/pyxis-web/commit/13c6b5bb8d7555def1acefeceef6a319a850e072))
* **shell:** tighten the page header and the demo banner on phones ([dfa2d21](https://github.com/samuelcsantana/pyxis-web/commit/dfa2d21dd15328766368c46abe002936b9126bde))
* **theme:** keep every theme toggle in step with the page ([9f1aa56](https://github.com/samuelcsantana/pyxis-web/commit/9f1aa560beb60bf6cbbad62be849c782957a8f96))
* **ui:** add a details popover that closes on Escape, focus-out and outside click ([48671f2](https://github.com/samuelcsantana/pyxis-web/commit/48671f2a332f82fb7b936da5e9d3d2a336267e76))
* **visits:** build property and device filters from report values ([93085d2](https://github.com/samuelcsantana/pyxis-web/commit/93085d2897bc16b75d60effb62c0de989fee7481))
* **visits:** download the newest 1,000 matching visits as a CSV file ([528da13](https://github.com/samuelcsantana/pyxis-web/commit/528da139c167e79226ba26cfa0777747232e2f01))


### Bug Fixes

* **a11y:** name the Overview's row links by their visible text ([20849c9](https://github.com/samuelcsantana/pyxis-web/commit/20849c9e89daa4d3780dbc98189f00e3ca579c59))
* **acquisition:** keep the conversions beside the rate and the medium on phones ([abdd27f](https://github.com/samuelcsantana/pyxis-web/commit/abdd27f64b361ae2c71fe3778396ad74e27283c2))
* **acquisition:** show the top unpaid channel when Paid leads ([498c0be](https://github.com/samuelcsantana/pyxis-web/commit/498c0be56e1b535ee6b85d6731fb932e6e7a04f8))
* **copy:** write the usual acronyms of an event name in capitals ([ba66243](https://github.com/samuelcsantana/pyxis-web/commit/ba662430da543bc6b6805043491d2d7dde355373))
* **features:** fill the event row that is open and edge its property panel ([1a15071](https://github.com/samuelcsantana/pyxis-web/commit/1a1507192e28222c22c6f710c5412e37c3f0c4c3))
* **format:** show every percentage and point change with one decimal ([f2628b0](https://github.com/samuelcsantana/pyxis-web/commit/f2628b0afe3bb0155a88cfdf17dcff872371c725))
* **funnel:** announce the editor's status as it changes ([02a4716](https://github.com/samuelcsantana/pyxis-web/commit/02a471665f8773f68609932c7b14a6738e1b19bf))
* **funnel:** fit each editor step in two rows on phones ([ba81d7d](https://github.com/samuelcsantana/pyxis-web/commit/ba81d7d2a45ae249ef386ac415e7b68b0170656c))
* **funnel:** make closing the step editor a secondary action ([5e9e43b](https://github.com/samuelcsantana/pyxis-web/commit/5e9e43bacf5b639b716d323ef1ac32d6fe868fb3))
* **funnel:** name the biggest drop-off by its step numbers ([1c87c9e](https://github.com/samuelcsantana/pyxis-web/commit/1c87c9e39c3415a88ae23f86dd1a3affa77e2b70))
* **funnel:** put the steps above the results ([07b0c60](https://github.com/samuelcsantana/pyxis-web/commit/07b0c608b4f3c158c2966316601a419dd10e5d23))
* **layout:** lay the KPI cards and the donuts out without an orphan on tablets ([d36919e](https://github.com/samuelcsantana/pyxis-web/commit/d36919e2e88b50b39895758c9e9c20ab8a6a3b8e))
* **overview:** give the daily chart 176px on phones ([dad5c85](https://github.com/samuelcsantana/pyxis-web/commit/dad5c8515e6a445a079924e36a07cc53bd515225))
* **overview:** stop the KPI cards from being landmark regions ([62bdd7f](https://github.com/samuelcsantana/pyxis-web/commit/62bdd7feb04340e3ce4cc433874c62a8357a1424))
* **requests:** keep the page still while the route details scroll ([b5581c5](https://github.com/samuelcsantana/pyxis-web/commit/b5581c518c0e00ab00969bd656b98f44dea15c1c))
* **search:** keep the search fields beside their buttons on phones ([463b9a2](https://github.com/samuelcsantana/pyxis-web/commit/463b9a29931e5bf7b585570c69737be78526c9ab))
* **shell:** close the custom period form on Escape, focus-out and outside click ([65473bc](https://github.com/samuelcsantana/pyxis-web/commit/65473bc575ca1f4f3960563066574c2960643a88))
* **shell:** close the project switcher on Escape, focus-out and outside click ([3bb1215](https://github.com/samuelcsantana/pyxis-web/commit/3bb1215b791dc5a98614ea8f21edd703f1ff7fd7))
* **shell:** keep the project switcher's chevron still under reduced motion ([42e9d16](https://github.com/samuelcsantana/pyxis-web/commit/42e9d1697394b95611b0f3e2e51afcd1b506d26f))
* **shell:** mark the current project with a check and the current-item fill ([306f804](https://github.com/samuelcsantana/pyxis-web/commit/306f804c1ff8ac6158816963fbef643d6b73496c))
* **shell:** mark the selected period with aria-current="page" ([787cbab](https://github.com/samuelcsantana/pyxis-web/commit/787cbab3ec23371b640d9968f1a705c059d1b104))
* **timeline:** count the summary in items, not events ([11d7b50](https://github.com/samuelcsantana/pyxis-web/commit/11d7b50530e21b2246e6e7eb1d68acc83b25a866))
* **timeline:** pad the visit and summary cards like the panels on phones ([e7e005c](https://github.com/samuelcsantana/pyxis-web/commit/e7e005c13286f722fceaf227af62348d1fd68639))
* **timeline:** say a request's duration and error code in words ([f814a97](https://github.com/samuelcsantana/pyxis-web/commit/f814a97a8a7f44350f9a99fb9aa033f30f77104d))
* **ui:** break identifiers between their tokens on narrow screens ([075f780](https://github.com/samuelcsantana/pyxis-web/commit/075f780006e93dd5f7b25dbcbc08713f23efa685))
* **ui:** size the stat cards for a phone ([76bc158](https://github.com/samuelcsantana/pyxis-web/commit/76bc15815899c6cf17e9439377efe430a4ddd987))
* **ui:** stop the stat cards from being landmark regions ([89c6aeb](https://github.com/samuelcsantana/pyxis-web/commit/89c6aeb7426bad8d8cc7e35d9a2b5dbc5ea130d1))
* **visits:** start a long user id's link name with the text it shows ([db7f50c](https://github.com/samuelcsantana/pyxis-web/commit/db7f50c031da04d40308dc7602773882d58ba52c))


### Refactoring

* **app:** extract the home, funnel and timeline empty states ([5374d8e](https://github.com/samuelcsantana/pyxis-web/commit/5374d8ed8192a6f616418bafa2f5472bd595919a))
* **features:** name the search match of the Features ranking ([dad138e](https://github.com/samuelcsantana/pyxis-web/commit/dad138e471b32bc02964458ffceef5393918eacb))
* **requests:** read the Requests report in one place ([d7dd457](https://github.com/samuelcsantana/pyxis-web/commit/d7dd457d9dc4f178e2bcebe78c18733fd0ce5325))


### Documentation

* **adr:** record how the dashboard will speak more than one language ([8523fc4](https://github.com/samuelcsantana/pyxis-web/commit/8523fc4f738ed0906b016fdeb1f55291c414e8f2))
* **readme:** describe event labels, Timeline items and the one-decimal rule ([37e4c4d](https://github.com/samuelcsantana/pyxis-web/commit/37e4c4dbd502feec50d3ee78e66ef0b18a3c316f))
* **readme:** describe the compact phone header ([e074bf4](https://github.com/samuelcsantana/pyxis-web/commit/e074bf4cbf5431dfaf4cf468cc390acc4b4cf6d9))
* **readme:** describe the CSV export of every table screen ([f96136c](https://github.com/samuelcsantana/pyxis-web/commit/f96136cb6e8c69c630d97d62192eb6a0d2772fea))
* **readme:** describe the CSV export of the Overview and Requests ([b2d248f](https://github.com/samuelcsantana/pyxis-web/commit/b2d248f824c63288167c1172cb8f6b2b8f227089))
* **readme:** describe the feedback while a screen changes in place ([bf17bb6](https://github.com/samuelcsantana/pyxis-web/commit/bf17bb669fbe0b1b170b526392babbc3289904cc))
* **readme:** describe the figure a KPI card plots and the chart hover ([99832c6](https://github.com/samuelcsantana/pyxis-web/commit/99832c64b61f3d7097a919aa0afdf5a1fa50d720))
* **readme:** describe the landmarks, live status and reduced-motion check ([ff229d0](https://github.com/samuelcsantana/pyxis-web/commit/ff229d06a0ff475fca902dae792cf4e8804ed469))
* **readme:** describe the links from every screen into Visits ([b900d27](https://github.com/samuelcsantana/pyxis-web/commit/b900d2711285147b038800256e404e5bc2fbf1e3))
* **readme:** describe the phone and tablet density ([36e9871](https://github.com/samuelcsantana/pyxis-web/commit/36e9871c1f7cf6c05ccff322d74d3972186d001e))
* **readme:** describe the phone Overview chart and Funnel editor ([2bfac0c](https://github.com/samuelcsantana/pyxis-web/commit/2bfac0cacbc58416ecab6c35f56cd51f14ff6338))
* **readme:** describe the phone search forms ([61acc1c](https://github.com/samuelcsantana/pyxis-web/commit/61acc1cdaaa5e822726c4f2dfb4388384964ba84))
* **readme:** list the shell and empty-page states shown in Storybook ([22a0b28](https://github.com/samuelcsantana/pyxis-web/commit/22a0b286b1ac5bb3e5b6b8f6ea67ec10d272268a))
* **readme:** say the shell popovers close on Escape, focus-out and outside click ([8dc4eb3](https://github.com/samuelcsantana/pyxis-web/commit/8dc4eb321a3804107a7e04958a276a7cb5e8d83b))
* **storybook:** show the app's empty pages under Pages/States ([06e847f](https://github.com/samuelcsantana/pyxis-web/commit/06e847f9a13a2f8597cfb326ac4545622b104945))
* **storybook:** show the request, timeline and panel states left out ([70d3f7a](https://github.com/samuelcsantana/pyxis-web/commit/70d3f7afa7053a1939474bb49f1d46922e2e1a98))
* **storybook:** show the shell's open, busy and failed states ([048bd50](https://github.com/samuelcsantana/pyxis-web/commit/048bd5001efbcf74392c95fb288819fda3a87b42))

## [0.4.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.3.0...v0.4.0) (2026-10-08)


### Features

* **acquisition:** draw the channel bars on the server, segments apart ([36534b5](https://github.com/samuelcsantana/pyxis-web/commit/36534b5386b3ec84122670a01aec2149835c4956))
* **charts:** draw a chart's axes, grid and day labels on the server ([f3befeb](https://github.com/samuelcsantana/pyxis-web/commit/f3befeb85d639c0ca64b0df943a4d5d2f0dfd993))
* **charts:** switch between chart and table with a segmented control ([fcf3cef](https://github.com/samuelcsantana/pyxis-web/commit/fcf3cef0b01f097d9dcca57f52810e5e5bbb0d0c))
* **contract:** read converting visits from the overview, devices and acquisition ([90cb88c](https://github.com/samuelcsantana/pyxis-web/commit/90cb88ccd32f866033923857df1bd07e689930f8))
* **contract:** read the kind of request the API reports ([4766d83](https://github.com/samuelcsantana/pyxis-web/commit/4766d8324fb3eeb83835d46d8d2420d4cdee8cbf))
* **contract:** read when each project's events began and last arrived ([9f50aec](https://github.com/samuelcsantana/pyxis-web/commit/9f50aec007d886ff4f54919610559b6d82f6a872))
* **design:** add a field border token at 3:1 ([779817b](https://github.com/samuelcsantana/pyxis-web/commit/779817b1e2cc7e6cc6361becc11e2ca7f46f7957))
* **design:** darken the light chart colours to 3:1 on the card ([99f031e](https://github.com/samuelcsantana/pyxis-web/commit/99f031e610f6be8cbfcc5dcd032e96ca7d491f3d))
* **design:** show links and fields on the control recipes page ([f3390bd](https://github.com/samuelcsantana/pyxis-web/commit/f3390bdd1c583da3f192416ecefe185eca491288))
* **devices,acquisition:** rate conversions over the visits that converted ([c001c05](https://github.com/samuelcsantana/pyxis-web/commit/c001c05e7d5bb30b447bdce354affd33fb2b2e68))
* **devices,overview:** say why conversions are missing, and let Countries fill the row ([613fdf8](https://github.com/samuelcsantana/pyxis-web/commit/613fdf847e715b1a2a060680bf71079517a37bde))
* **devices:** give the conversion rate of each browser, system and country ([8e95910](https://github.com/samuelcsantana/pyxis-web/commit/8e9591009554a346c3531040386e57ea55139430))
* **domain:** compute chart scales, day labels, areas and stacked bars ([9db9635](https://github.com/samuelcsantana/pyxis-web/commit/9db96355ad2a3175454c9b52d91854e71272692c))
* **email:** serve a raster logo for the sign-in email ([7683349](https://github.com/samuelcsantana/pyxis-web/commit/76833496a74ffb617c59d46b15dbe8af4a2273e3))
* **overview:** count conversions as visits that converted ([6f1ee43](https://github.com/samuelcsantana/pyxis-web/commit/6f1ee43ca964f4728cb0e41bf317edb2c045feae))
* **overview:** define its words in a footnote ([bda09e9](https://github.com/samuelcsantana/pyxis-web/commit/bda09e945e5043eb8304da13aa0bc73c00375e6e))
* **overview:** draw the daily activity chart on the server ([7b4e04b](https://github.com/samuelcsantana/pyxis-web/commit/7b4e04bce3dbd8f9a26d438e8dc9114f5c78603e))
* **overview:** name the conversion event on the Conversions card ([184770a](https://github.com/samuelcsantana/pyxis-web/commit/184770a2de68eb0c2d743c077b7dcf7f1cf2fcfd))
* **overview:** say what every change is compared with ([73d8ef5](https://github.com/samuelcsantana/pyxis-web/commit/73d8ef5be0fe0f2642123603dd5998d300abe3da))
* **overview:** show how many visits had each top event ([35ca6e4](https://github.com/samuelcsantana/pyxis-web/commit/35ca6e4306762fa484824a3091771ed3a342ed46))
* **period:** keep a custom range it could not use, and why ([7c5291f](https://github.com/samuelcsantana/pyxis-web/commit/7c5291f48a1e05c0a9bdd9117342e0397440db88))
* **requests:** add a "Failed reads" tab next to the writes ([e3d66f0](https://github.com/samuelcsantana/pyxis-web/commit/e3d66f0759a1f913a7cf66062b0ae4b8fbee368b))
* **services:** ask the API for the routes whose reads failed ([ae6ee43](https://github.com/samuelcsantana/pyxis-web/commit/ae6ee43842cab2efd219dbdf4cf12324de947ec5))
* **shell:** add a skip link to the content of every project screen ([53a6e9c](https://github.com/samuelcsantana/pyxis-web/commit/53a6e9ca607d4789f19543b8790e4bcfd86c490a))
* **shell:** keep a slim menu bar at the top of phone screens ([ea24048](https://github.com/samuelcsantana/pyxis-web/commit/ea240488cf45a9b2a7f9525766ee83dbbfd55b8c))
* **shell:** say when a custom range was not used, and reopen it with its dates ([dc3e601](https://github.com/samuelcsantana/pyxis-web/commit/dc3e601390851a1737c8597209dc3c41286a4c66))
* **states:** tell a quiet period from a project that never received an event ([943ce16](https://github.com/samuelcsantana/pyxis-web/commit/943ce16cdc1f3c3aa949e029e64377ff316e7925))
* **visits:** fold the filters behind a toggle on phones ([afab4ea](https://github.com/samuelcsantana/pyxis-web/commit/afab4eaf1e0d50385c8029d0bcdfbfd1f29646cb))
* **visits:** name the country of each visit beside its device ([e51aaef](https://github.com/samuelcsantana/pyxis-web/commit/e51aaefb47d0eab0befa7680c8523a9adcc8725f))
* **visits:** show each visit as a card on phones ([79a9f55](https://github.com/samuelcsantana/pyxis-web/commit/79a9f557c533c21a3ad866e4c548db6ba4010b67))


### Bug Fixes

* **a11y:** put the demo banner and the sign-in theme toggle in landmarks ([475a584](https://github.com/samuelcsantana/pyxis-web/commit/475a584578f68fd88393b3c054cc97b0d42d5220))
* **overview:** name the Top pages table after its heading ([f3c1e7b](https://github.com/samuelcsantana/pyxis-web/commit/f3c1e7b90f0dbffe77b7ec058a3af70df1c361da))
* **overview:** title the daily chart "Activity per day" ([eedacdf](https://github.com/samuelcsantana/pyxis-web/commit/eedacdf94b33adbf3be8c4bfc819dcb610573149))
* **requests:** call the error rate "Write error rate", as the Overview does ([c61fc01](https://github.com/samuelcsantana/pyxis-web/commit/c61fc01185d3cffa51d8af78e4866fbb72f32be8))
* **shell:** close the phone menu on Escape and when the address changes ([8dda603](https://github.com/samuelcsantana/pyxis-web/commit/8dda60386fed90447e944d8bb02e0350aae299c8))
* **shell:** fit the sidebar in 700 px so Sign out shows on a 1366x768 laptop ([cdcd7bb](https://github.com/samuelcsantana/pyxis-web/commit/cdcd7bb1c6b287b10057b80bea3c6337b5f9db8e))
* **shell:** wrap the project name and time zone instead of cutting them ([0599046](https://github.com/samuelcsantana/pyxis-web/commit/0599046d76cfe958143969d17a88483c2fbce937))
* **timeline:** call the failed-requests filter "Failing only", as Requests does ([9973fce](https://github.com/samuelcsantana/pyxis-web/commit/9973fce303f0f2f4c0c9748e3e91a54aeacf5217))
* **timeline:** keep an id it could not use, and say what an id looks like ([82856bb](https://github.com/samuelcsantana/pyxis-web/commit/82856bb9c6f842691bb60051f8e97521c1138581))
* **ui:** draw inputs and selects with the 3:1 field border ([0cab6fb](https://github.com/samuelcsantana/pyxis-web/commit/0cab6fb619a29e1c700f561d7fca2fe1d60377a0))
* **ui:** thicken the underline of text links on hover and press ([a5df793](https://github.com/samuelcsantana/pyxis-web/commit/a5df793ffc0c4141bea0470db82ab4f702aeb67a))
* **ui:** use 16px text in form fields below the sm breakpoint ([12221d9](https://github.com/samuelcsantana/pyxis-web/commit/12221d95350440df3a372fad9107467cddaa92d2))
* **ui:** visible underline and a 24px target for row links ([6835586](https://github.com/samuelcsantana/pyxis-web/commit/6835586a29544f95979a21dee1cbcbdf6d403bf2))
* **visits:** keep the visits table inside its panel at 1024 px ([6bf17b4](https://github.com/samuelcsantana/pyxis-web/commit/6bf17b45c310036a0a99c0b5304283f5528b7b02))
* **visits:** leave room in the 1024 px visits table for wider fonts ([a2ccd43](https://github.com/samuelcsantana/pyxis-web/commit/a2ccd43d0c2f4cc32b008a33994d474f768111b4))
* **visits:** say that a failed request on Visits is a read or a write ([28740a4](https://github.com/samuelcsantana/pyxis-web/commit/28740a406e281a72a3a0a18bcdd9523b424d25dc))
* **visits:** write "Anonymous" in sentence case, as the filter does ([43df953](https://github.com/samuelcsantana/pyxis-web/commit/43df95385f410b4d0586a396e2734e842dc0a4da))


### Refactoring

* **domain:** count the visit filters in use ([37bb531](https://github.com/samuelcsantana/pyxis-web/commit/37bb531b333891d09dc0bdcb33f631094918eed3))
* **ui:** draw page tabs with a shared link-tabs component ([afe6fa1](https://github.com/samuelcsantana/pyxis-web/commit/afe6fa18837a54c390dfeeb926a91b34c458a103))


### Documentation

* **adr:** record SVG charts drawn on the server, superseding ADR 0005 ([d07edff](https://github.com/samuelcsantana/pyxis-web/commit/d07edff96f2b9c0af0e53a78b7a6d9775c8c6db0))
* **readme:** describe conversion rates over converting visits ([b720893](https://github.com/samuelcsantana/pyxis-web/commit/b720893f207b2bc2e5e61a746f34078761142952))
* **readme:** describe the conversion rates on Devices and the visits of top events ([416dd44](https://github.com/samuelcsantana/pyxis-web/commit/416dd44f1925d3e8d48143920b395cfdd9e513a0))
* **readme:** describe the failed reads tab on Requests ([0f7d13f](https://github.com/samuelcsantana/pyxis-web/commit/0f7d13f0d300e455e145241b202286d5701425a3))
* **readme:** describe the field borders, link underlines and row link targets ([b9f5b00](https://github.com/samuelcsantana/pyxis-web/commit/b9f5b00c770c456f439c3da788fb802803d5e641))
* **readme:** describe the overview's comparisons, footnote and shared words ([3498cc6](https://github.com/samuelcsantana/pyxis-web/commit/3498cc6f6bd3cf622face1bc3a1772e7f2498089))
* **readme:** describe the quiet period and the missing conversion event ([2310817](https://github.com/samuelcsantana/pyxis-web/commit/2310817922f63aa012f2da678e91da84c4cd30e4))
* **readme:** describe the skip link and the phone menu bar ([9f834a6](https://github.com/samuelcsantana/pyxis-web/commit/9f834a6b3bcb1102ca29eccce03eefb67e30e888))
* **readme:** say the sidebar fits a laptop screen and wraps long values ([329a815](https://github.com/samuelcsantana/pyxis-web/commit/329a815373934e34f86a2b14d8fb83de3e45d8c8))
* **readme:** say where the sign-in email's logo lives and why it needs no session ([cb0eeef](https://github.com/samuelcsantana/pyxis-web/commit/cb0eeef3e94d93ad6e24e8ee8f95ddf9055b0772))

## [0.3.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.2.0...v0.3.0) (2026-10-07)


### Features

* **app:** catch a failed sign-in check with a branded error screen ([dfa38c4](https://github.com/samuelcsantana/pyxis-web/commit/dfa38c4b8c95b813b50b4791b3e224d4e16c59e5))
* **app:** colour the browser bar with the background of the chosen theme ([1912161](https://github.com/samuelcsantana/pyxis-web/commit/191216195f61d506f36c71be66b08156095643e1))
* **app:** draw a branded page when the root layout itself fails ([7bc652a](https://github.com/samuelcsantana/pyxis-web/commit/7bc652a8533df1ff3d89daedb0f0e1ed00dc24ce))
* **app:** keep the project shell around an unknown screen ([7fdf06a](https://github.com/samuelcsantana/pyxis-web/commit/7fdf06ac954daadbf7ed46439cb1ed41f0532bcc))
* **app:** name the project in the title of every screen ([bbec1d8](https://github.com/samuelcsantana/pyxis-web/commit/bbec1d8707479d6e3d91a4548b27cc7242decedb))
* **app:** open the demo to search engines and keep the dashboard out ([c9a976d](https://github.com/samuelcsantana/pyxis-web/commit/c9a976dda32ae37c3ea41fc95fd77f6e26b68939))
* **app:** serve /favicon.ico ([770d837](https://github.com/samuelcsantana/pyxis-web/commit/770d837ad124953d34b95ae68520d04fe41bb60d))
* **app:** serve a web app manifest ([7563a57](https://github.com/samuelcsantana/pyxis-web/commit/7563a5712eeb8aa80cddd1e7e1c02c01293091b8))
* **app:** show a link preview card for the demo and the sign-in page ([2033c39](https://github.com/samuelcsantana/pyxis-web/commit/2033c39f38697b53b84c720b5d06df77937042e3))
* **demo:** derive every demo screen from one invented dataset ([13a6aad](https://github.com/samuelcsantana/pyxis-web/commit/13a6aad1920e19ffb95660f9b7a5263f738b23a6))
* **design:** add a focus token that keeps 3:1 contrast in both themes ([2004f5e](https://github.com/samuelcsantana/pyxis-web/commit/2004f5e1190133fbac002aede0bc828091231adc))
* **design:** add a sidebar hover token and raise the current item ([eb3dd6f](https://github.com/samuelcsantana/pyxis-web/commit/eb3dd6fdb67a2dfa8d4931b9c8e5b68b415b5c92))
* **design:** add hover and pressed tokens for primary and strong buttons ([6964ea4](https://github.com/samuelcsantana/pyxis-web/commit/6964ea427814983f55d8e650875f478a314675d5))
* **design:** show every control recipe in its states in Storybook ([3cb5ac2](https://github.com/samuelcsantana/pyxis-web/commit/3cb5ac29b087dd12e6f21eb95707b3a4299a577a))
* **design:** show the pointer cursor on enabled buttons ([0534ef7](https://github.com/samuelcsantana/pyxis-web/commit/0534ef7189009c798b180728951626219844af97))
* **funnel:** open the demo on the example funnel of the project ([5ba1101](https://github.com/samuelcsantana/pyxis-web/commit/5ba1101dc9e692924ba21ebb9feb0ca6109b1e65))
* **funnel:** validate the editor's steps without the Zod schema ([b4fe5ff](https://github.com/samuelcsantana/pyxis-web/commit/b4fe5ff81eea50e45d74c81777a5302d5cecbe36))
* **overview:** leave days without writes out of the error rate line ([30cc8fb](https://github.com/samuelcsantana/pyxis-web/commit/30cc8fb39cd74c18f77901315bb60026a3473572))
* **overview:** read the comparison cutoff and the previous days ([52b9c4d](https://github.com/samuelcsantana/pyxis-web/commit/52b9c4d410ed9cfa1455967b8f2369fcb7193af3))
* **overview:** say what today is compared with ([4017c36](https://github.com/samuelcsantana/pyxis-web/commit/4017c361fbb7f21ee1b1ef42d748a0780a80d99d))
* **overview:** say whether a change is good news, not only in colour ([346d00f](https://github.com/samuelcsantana/pyxis-web/commit/346d00f1b42aeaa187cdd6b3b91e353e76127a07))
* **overview:** show a single day as figures, not a chart of one point ([2d85367](https://github.com/samuelcsantana/pyxis-web/commit/2d85367bb75f0e0eec8774d1cfaa6601e9f3cf20))
* **overview:** show the size of a change and judge only real moves ([6358267](https://github.com/samuelcsantana/pyxis-web/commit/63582678bd76dcacee03bee51ea09121fc8bcae1))
* **requests:** keep the open route in the address ([025dca9](https://github.com/samuelcsantana/pyxis-web/commit/025dca9450c96a1929bc3a0b3c4010f62661f778))
* **services:** log the route, status and duration of every API read ([c56f527](https://github.com/samuelcsantana/pyxis-web/commit/c56f5275244dc5b002c994e2de3f52be8f208109))
* **shell:** link the demo banner to the source code ([6ae5704](https://github.com/samuelcsantana/pyxis-web/commit/6ae57046a3ebe47d7fb688707e27e78b3aa5b184))
* **sign-in:** come back to the screen that sent the visitor to sign in ([d8cf056](https://github.com/samuelcsantana/pyxis-web/commit/d8cf0566cd81281371214c6135753d01c5b14a9b))
* **sign-in:** tell demo visitors the code before they send an email ([b2010a8](https://github.com/samuelcsantana/pyxis-web/commit/b2010a84e3e42527b4cc9588e90a8a30e17c8217))
* **states:** give the project error page its h1 ([9cf6b16](https://github.com/samuelcsantana/pyxis-web/commit/9cf6b1640291dc7dcef0d65fa616411bc5892f4b))
* **states:** keep the top bar and the destination title while a screen loads ([c41774c](https://github.com/samuelcsantana/pyxis-web/commit/c41774c34cb3b93455cbe9ad658896151cc19ac2))
* **states:** let an empty state head a page ([58923b8](https://github.com/samuelcsantana/pyxis-web/commit/58923b8e9631eb28879c6f2b758755157ad95cf6))
* **timeline:** keep the period through the Timeline, for the way back ([0f8f286](https://github.com/samuelcsantana/pyxis-web/commit/0f8f286971808d1c9e4917b339979c69a09e3f77))
* **timeline:** suggest the demo person of each demo project ([2b862b6](https://github.com/samuelcsantana/pyxis-web/commit/2b862b64e33fcecbcc0513ee7291d64463315533))


### Bug Fixes

* **a11y:** draw every focus ring from the focus token ([517efe3](https://github.com/samuelcsantana/pyxis-web/commit/517efe3fe495f5938720e34a2bf75d1ad6903e63))
* **app:** title the 404 page "Page not found" and give it an h1 and the logo ([0f1559e](https://github.com/samuelcsantana/pyxis-web/commit/0f1559e25c7504a3336d0c076548f74de94fbc45))
* **charts:** keep a phone page as wide as the screen before the charts mount ([cf4d3b2](https://github.com/samuelcsantana/pyxis-web/commit/cf4d3b207f89bba008710d0154a98edd383a3224))
* **shell:** make sidebar items react visibly to the pointer ([ce57e31](https://github.com/samuelcsantana/pyxis-web/commit/ce57e31368db5058bfd7214e45fa453b9551c897))
* **sign-in:** drop "Code sent." as soon as an error shows ([81d499f](https://github.com/samuelcsantana/pyxis-web/commit/81d499f119a4b3b42618cfe0d22f66ed7309c47b))
* **sign-in:** put the focus on the email field after "Use a different email" ([6217f49](https://github.com/samuelcsantana/pyxis-web/commit/6217f4964158c3bf62354835a3fb20f5866d6ebd))
* **sign-in:** tie an email-step error to the email field ([0b0d5e1](https://github.com/samuelcsantana/pyxis-web/commit/0b0d5e1b1e4d2068403a0cf3ecae086f8a2f1608))
* **states:** stop promising that events are still being collected ([19092d3](https://github.com/samuelcsantana/pyxis-web/commit/19092d3269b388ba0286bae563243c1a60a9ebba))
* **ui:** darken the border of secondary and icon buttons on hover and press ([e09abe5](https://github.com/samuelcsantana/pyxis-web/commit/e09abe547d8a40d3df3104db1f595c0fdd0a6a2a))
* **ui:** give primary and strong buttons hover and pressed fills ([f012d30](https://github.com/samuelcsantana/pyxis-web/commit/f012d30adb518b6d066c23af4da16f10210b57c6))
* **ui:** give segmented options, tabs and pills a pressed state ([c6ced71](https://github.com/samuelcsantana/pyxis-web/commit/c6ced7102d3cdea41bb2a63fe9d7bc42d0257e23))


### Refactoring

* **app:** check the project while resolving each screen's title ([f77cd4e](https://github.com/samuelcsantana/pyxis-web/commit/f77cd4e6e300eee6aabc4be766e37c51d33a535c))
* **app:** load the document fonts from one module ([7c43f2e](https://github.com/samuelcsantana/pyxis-web/commit/7c43f2e5b8912306dde07d638c38b3df487f6695))
* **domain:** keep the response schemas in their own modules ([202d625](https://github.com/samuelcsantana/pyxis-web/commit/202d6255c42d3d7698707dba9ec97d693893f5fe))
* **e2e:** read a control's paint in one place ([9594b83](https://github.com/samuelcsantana/pyxis-web/commit/9594b83d313fb81bb9778589c543860004231f68))
* **shell:** split the top bar into a frame that takes any controls ([b679719](https://github.com/samuelcsantana/pyxis-web/commit/b679719d97503ae5109270233da741652ec3271d))
* **states:** draw the error screen inside the branded page frame ([6db4fe1](https://github.com/samuelcsantana/pyxis-web/commit/6db4fe19f880b710a301ee2a66f3496c0c846028))


### Documentation

* **readme:** describe the control recipes and their states ([8415213](https://github.com/samuelcsantana/pyxis-web/commit/841521315773fca89c0beff66ca96d4b88715999))
* **readme:** describe the honest comparisons on the Overview ([b832cc5](https://github.com/samuelcsantana/pyxis-web/commit/b832cc5d33e96225f5888d9709cef8fdaab35c90))
* **readme:** describe the two demo products and their shared dataset ([20da7a8](https://github.com/samuelcsantana/pyxis-web/commit/20da7a8cce6fc81e7fb23a677177771c61634de7))
* **readme:** say the response schemas stay on the server ([940d478](https://github.com/samuelcsantana/pyxis-web/commit/940d47818bccaa21667eed0711274ef4b30dd375))
* **storybook:** show the focus ring in the top bar and the sidebar ([f8dd44c](https://github.com/samuelcsantana/pyxis-web/commit/f8dd44c82570c5e61f5dcdf89ef8e0f312283499))
* **storybook:** show the theme toggle hovered and keyboard-focused ([e3fcd8e](https://github.com/samuelcsantana/pyxis-web/commit/e3fcd8e6e578d19508e2d930fdcedf4f8ea9059b))

## [0.2.0](https://github.com/samuelcsantana/pyxis-web/compare/v0.1.1...v0.2.0) (2026-10-07)


### Features

* **domain:** read the visit filters from the URL and describe each visit ([a066fd2](https://github.com/samuelcsantana/pyxis-web/commit/a066fd2d07568fc2d8975282703878d347d1dd44))
* **domain:** shape the property breakdown of an event for the screen ([fa40199](https://github.com/samuelcsantana/pyxis-web/commit/fa40199f625d3803782710b2bfa3a01d89ecff94))
* **features:** load an event's property breakdown on the Features page ([50da305](https://github.com/samuelcsantana/pyxis-web/commit/50da305171c28d4e1f102795f57c79b02864e78c))
* **features:** open an event row into its property breakdown ([031a33f](https://github.com/samuelcsantana/pyxis-web/commit/031a33f1b946af17fec2c8a2bdc7a3d2dbb3ebb7))
* **overview:** link the top pages and events to their visits ([dac8841](https://github.com/samuelcsantana/pyxis-web/commit/dac884104866febd7fc7e9b301b5ead2cc44dd26))
* **services:** read the property breakdown of an event, with demo values ([45357af](https://github.com/samuelcsantana/pyxis-web/commit/45357aff0e3a85e13d78edf5043b07d27cbc34b4))
* **services:** read the visits list from the API, or invent it ([854dd9c](https://github.com/samuelcsantana/pyxis-web/commit/854dd9c013460093ad1cbe06949b8fc1489a4ef0))
* **visits:** draw the filters, the visits table and the older visits ([147658d](https://github.com/samuelcsantana/pyxis-web/commit/147658ddd7a73bd74dad215fc50e5515580b7547))
* **visits:** open the Visits screen with its filters in the URL ([563ae77](https://github.com/samuelcsantana/pyxis-web/commit/563ae77bcf75c25f5ed1d70b3bb9af739ef2a920))


### Documentation

* **readme:** describe the property breakdown on Features ([465bb8a](https://github.com/samuelcsantana/pyxis-web/commit/465bb8a5377b8437e3c2e884fee760615ebbbd21))
* **readme:** describe the Visits screen and the Overview links ([17c28a7](https://github.com/samuelcsantana/pyxis-web/commit/17c28a79bc51dd7b0a34cd9a3b24929d5f303926))

## [0.1.1](https://github.com/samuelcsantana/pyxis-web/compare/v0.1.0...v0.1.1) (2026-10-07)


### Bug Fixes

* **demo:** open a demo visit from every latest failure, at the same time ([d6c3444](https://github.com/samuelcsantana/pyxis-web/commit/d6c3444dabde9fd0729ffa28b197b088f83fef5a))


### Refactoring

* **demo:** move the demo visits next to the other demo data ([c6cf913](https://github.com/samuelcsantana/pyxis-web/commit/c6cf91339be031185f5164af0be9de320742f4f6))


### Documentation

* **readme:** open with a short tour of the live demo ([4a6daf0](https://github.com/samuelcsantana/pyxis-web/commit/4a6daf01abbaeb038181f1e74ee8e5ee9b04f31a))
* **readme:** record the tour and the requests screenshot again after the demo fix ([b4c951a](https://github.com/samuelcsantana/pyxis-web/commit/b4c951ae937e731f3e9e2a476e49c6e96bd03d65))

## 0.1.0 (2026-10-06)


### Features

* **acquisition:** draw visits by channel, the sources and stat cards ([01bc441](https://github.com/samuelcsantana/pyxis-web/commit/01bc4418fe2ea5bd0c64bbf1e48c6554ec992fdf))
* **acquisition:** open the Acquisition screen ([b995cc0](https://github.com/samuelcsantana/pyxis-web/commit/b995cc0c2d32a1d33439804a3d287ab0bd80d91d))
* **app:** route admins to their projects behind a session check ([9200dcc](https://github.com/samuelcsantana/pyxis-web/commit/9200dccc7358f8b3b1a1459ac5ab10080bf42ee5))
* **devices:** draw the share donuts, conversion by device and countries ([7d4fe54](https://github.com/samuelcsantana/pyxis-web/commit/7d4fe54cd114960ca89adc0e350b9ba155845790))
* **devices:** open the Devices screen ([dabe4ce](https://github.com/samuelcsantana/pyxis-web/commit/dabe4ce4b441aeee8f55d02c2d0847154ea4e4c5))
* **domain:** add up visits by channel and rate the sources ([3b54e40](https://github.com/samuelcsantana/pyxis-web/commit/3b54e401b9a6c415a99f592f2c3df0068b2f0638))
* **domain:** break the writes down by route, status and failure ([3355d3f](https://github.com/samuelcsantana/pyxis-web/commit/3355d3f8a86fa917c4e58c5600fb83183e2eceb4))
* **domain:** derive the overview figures, their changes and rates ([1e2217a](https://github.com/samuelcsantana/pyxis-web/commit/1e2217aab512b2719f8c8843690920c2370f81d1))
* **domain:** label devices and countries, and measure their shares ([337a15b](https://github.com/samuelcsantana/pyxis-web/commit/337a15b1e18d60095060ea76bad0a2fc0e659123))
* **domain:** periods in the project time zone, the admin and its projects ([218dbc8](https://github.com/samuelcsantana/pyxis-web/commit/218dbc888bf3da36387a96fb2a28940402d2a8ec))
* **domain:** rank the features and search them by name ([ce14530](https://github.com/samuelcsantana/pyxis-web/commit/ce145300cb3ee1b536fddc69651115055df307ca))
* **domain:** read funnel steps from the URL and measure each step ([ac655ad](https://github.com/samuelcsantana/pyxis-web/commit/ac655adc69c9f3ea5fe0af0b497936d5102969fe))
* **domain:** turn a person's or a visit's events into a story ([dc80763](https://github.com/samuelcsantana/pyxis-web/commit/dc80763b8c08190ae38c8f8cde2fd256555a3dc0))
* **features:** draw the kind tabs, the search and the ranking ([6cb6d7b](https://github.com/samuelcsantana/pyxis-web/commit/6cb6d7b6e5f8f4c94c33c2894437390a907a7417))
* **features:** open the Features screen ([fb2e7c5](https://github.com/samuelcsantana/pyxis-web/commit/fb2e7c537fa077ca32407201767e046cf68026f9))
* **funnel:** draw the steps, the mode links and the step editor ([a36bc45](https://github.com/samuelcsantana/pyxis-web/commit/a36bc452a20ded28bfe06b9e1ca7b121d65da47f))
* **funnel:** open the Funnel screen with its steps in the URL ([a787a4f](https://github.com/samuelcsantana/pyxis-web/commit/a787a4f06105649cc00dad9078a2d681f7448f9e))
* **overview:** draw the figures, the daily chart and the top lists ([4ac1a1a](https://github.com/samuelcsantana/pyxis-web/commit/4ac1a1a520aae67f49f84a8b8161130e43cb8c71))
* **overview:** show the overview report instead of the project panel ([384035f](https://github.com/samuelcsantana/pyxis-web/commit/384035f67452c0085602a552570bee8dbe813659))
* **requests:** draw the routes and the route details panel ([76f9e76](https://github.com/samuelcsantana/pyxis-web/commit/76f9e7635fe56d22c96c8555ffbf05a415a142b0))
* **requests:** link a failure to its visit's timeline ([4eb8395](https://github.com/samuelcsantana/pyxis-web/commit/4eb839509fba8b22ea223c35f82b5bab953a2f27))
* **requests:** open the Requests screen with its filters in the URL ([908e7b0](https://github.com/samuelcsantana/pyxis-web/commit/908e7b0b61f4cda561568fdd7ff339cc6fc580f1))
* **security:** send a strict csp and hardening headers on every page ([1fc1188](https://github.com/samuelcsantana/pyxis-web/commit/1fc11887a7a06cfc3becb4a4a99c88b0709ad68b))
* **services:** page the demo timeline two visits at a time ([3e14f96](https://github.com/samuelcsantana/pyxis-web/commit/3e14f969e16c5d995e2b3e9e47a7efc3e5b7caf3))
* **services:** read a timeline from the API, or invent the board's story ([79524f9](https://github.com/samuelcsantana/pyxis-web/commit/79524f9d2c77c46f88ff9049b41c451d3bb8ded1))
* **services:** read the acquisition report from the API, or invent it ([2490d51](https://github.com/samuelcsantana/pyxis-web/commit/2490d51d5ad3fb224d75b01c758d3c6d664e95ed))
* **services:** read the devices breakdown from the API, or invent it ([50c144c](https://github.com/samuelcsantana/pyxis-web/commit/50c144c58ade7b18d2f80cd4c9f39f47851c2b4a))
* **services:** read the features ranking from the API, or invent it ([4542ea9](https://github.com/samuelcsantana/pyxis-web/commit/4542ea9d932d85658d6b2864272ed5b0eef440f6))
* **services:** read the funnel from the API, or invent it ([d036a42](https://github.com/samuelcsantana/pyxis-web/commit/d036a425542988333dda25286decb622ca5f6cfa))
* **services:** read the overview from the API, or invent it without one ([140d3d7](https://github.com/samuelcsantana/pyxis-web/commit/140d3d75c78ad1804247ecbf8314ac22a60f0f6a))
* **services:** read the requests report from the API, or invent it ([75cae17](https://github.com/samuelcsantana/pyxis-web/commit/75cae1799bed59a5fcc7e90ce0b60fbf42c0c2fe))
* **services:** sign-in and projects services, over HTTP or with demo data ([1c06651](https://github.com/samuelcsantana/pyxis-web/commit/1c066516585f43505109badba03b8ce80c44d780))
* **shell:** keep a screen's own parameters when the period changes ([ab4987a](https://github.com/samuelcsantana/pyxis-web/commit/ab4987a7188bf8f96e7fdd889ac5389827233a63))
* **shell:** let a screen go without the period controls ([ba17d68](https://github.com/samuelcsantana/pyxis-web/commit/ba17d68b1364a1ecbd5e8b1b3be458d32ebaf980))
* **shell:** sidebar, top bar, project switcher and period selector ([1c95423](https://github.com/samuelcsantana/pyxis-web/commit/1c954234f2959203dac9a381b8986ce6e7775b83))
* **sign-in:** sign in with a code sent by email ([81843e7](https://github.com/samuelcsantana/pyxis-web/commit/81843e7594f25528e71ecfc94740871482b9eb1c))
* **states:** loading, empty, error and demo panels ([f25885b](https://github.com/samuelcsantana/pyxis-web/commit/f25885b9e4512841ba00a780094db19addb8ad94))
* **theme:** light and dark themes remembered in a cookie ([7b6b142](https://github.com/samuelcsantana/pyxis-web/commit/7b6b142038b1e9939d09ca67e61554aa0815869b))
* **timeline:** draw the lookup, the filters and the visits ([4d21a95](https://github.com/samuelcsantana/pyxis-web/commit/4d21a95d2487cac4f3b0aa9349aeb638a47e458e))
* **timeline:** lead a visitor of the demo to the demo person ([729578b](https://github.com/samuelcsantana/pyxis-web/commit/729578bff90d6f1dd3d2a38cb884f06e923b98d3))
* **timeline:** load older visits with a server action ([00dbcec](https://github.com/samuelcsantana/pyxis-web/commit/00dbceca359ff68621e054a8e2220f395b6767ee))
* **timeline:** open the Timeline screen ([edfac12](https://github.com/samuelcsantana/pyxis-web/commit/edfac12df0ab19d0c3c9e9e7fc633b1766b435d3))


### Bug Fixes

* **demo:** vary the invented numbers from one day to the next ([756cde8](https://github.com/samuelcsantana/pyxis-web/commit/756cde8b4a0cd47e183399238be53a502a1ce103))
* **overview:** treat a change that rounds to zero as no change ([4c5b55f](https://github.com/samuelcsantana/pyxis-web/commit/4c5b55f6832db45319e1f5daa8e4064f4e4ba32d))
* **shell:** keep the custom period form closed and on screen ([d5ca8c2](https://github.com/samuelcsantana/pyxis-web/commit/d5ca8c2d5c8f61815c8498ce246d63142e18efe4))
* **shell:** stretch the sidebar down the whole screen ([dd7f774](https://github.com/samuelcsantana/pyxis-web/commit/dd7f7742943f4d6ab1eb75b7629f1aa4dbf02a1e))


### Refactoring

* **charts:** share the chart panel with its table toggle ([5e076fd](https://github.com/samuelcsantana/pyxis-web/commit/5e076fde80e53e28c3636f7be670669e8bec70ec))
* **components:** share the panel and table classes ([81253c0](https://github.com/samuelcsantana/pyxis-web/commit/81253c099a65745672353b6665cd3fb2f62988dc))
* **services:** share one reader for the API across services ([95f8db4](https://github.com/samuelcsantana/pyxis-web/commit/95f8db49f340a1fc642f275b09e1dca200a9f11b))
* **services:** share the date range query and the demo visits ([9793018](https://github.com/samuelcsantana/pyxis-web/commit/9793018a0c32056315a74f8710f4372f07f3fee2))
* **states:** share the install instructions with every screen ([ec062a8](https://github.com/samuelcsantana/pyxis-web/commit/ec062a804d2b9c9a40c1add18c1dfc65ac37167c))
* **ui:** share the sparkline ([5fb25b8](https://github.com/samuelcsantana/pyxis-web/commit/5fb25b832d5dfe4f45d3e7d89921dd33381586d6))


### Documentation

* add community health files ([2fbd719](https://github.com/samuelcsantana/pyxis-web/commit/2fbd719249be3a61c73fcf9ceb69214c834578eb))
* add the readme, the brand assets and the first adrs ([cd93dc9](https://github.com/samuelcsantana/pyxis-web/commit/cd93dc9b45cce3f03db27143785bc19b39197771))
* document sign-in and the shell, and record ADR 0004 ([c64d500](https://github.com/samuelcsantana/pyxis-web/commit/c64d500b88662bf2c6b7e4e5e52eab65c26746c0))
* **readme:** describe the Acquisition screen ([c0ac3b0](https://github.com/samuelcsantana/pyxis-web/commit/c0ac3b08cd3e91e06e062a83d82aa367c5be17ac))
* **readme:** describe the Devices screen ([7957e0f](https://github.com/samuelcsantana/pyxis-web/commit/7957e0f982105a515e538642908775c5e54ca358))
* **readme:** describe the Features screen ([80c2e36](https://github.com/samuelcsantana/pyxis-web/commit/80c2e36ed1176e8c7dd4ca46a8a8220489f72484))
* **readme:** describe the Funnel screen ([c995acb](https://github.com/samuelcsantana/pyxis-web/commit/c995acbe801a0236b533ab66bb710ce5b9442ddb))
* **readme:** describe the overview screen ([cff77b3](https://github.com/samuelcsantana/pyxis-web/commit/cff77b398512a699211a34e65acdf6fe8404d4ae))
* **readme:** describe the Requests screen ([5fc0afc](https://github.com/samuelcsantana/pyxis-web/commit/5fc0afc0dcb87fa392387e69fce79e5e493560f9))
* **readme:** describe the Timeline screen ([a345037](https://github.com/samuelcsantana/pyxis-web/commit/a345037c6d910bbae34f1c7aff5a0fe144f2bccb))
* **readme:** link the live demo and describe the two deployments ([97a106d](https://github.com/samuelcsantana/pyxis-web/commit/97a106da3b7c9672a6259fcc19fc343669ac993d))
* **readme:** mention older visits and the links from failures ([486df06](https://github.com/samuelcsantana/pyxis-web/commit/486df0627eba35b8860be2259c2eaa33fa74a965))
* **readme:** show the dashboard, link the public pages, update the status ([8bffd35](https://github.com/samuelcsantana/pyxis-web/commit/8bffd35ef17945aed4f7f0252fa37b3f1a79bb1a))
