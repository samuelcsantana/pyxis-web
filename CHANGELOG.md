# Changelog

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
