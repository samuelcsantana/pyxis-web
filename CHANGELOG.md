# Changelog

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
