![mintProcess](https://github.com/beubeubeubeu/SafeTickets/assets/4832337/565112d2-f0dc-46f9-858d-483042858070)# SafeTickets

![hardhat tests workflow](https://github.com/beubeubeubeu/SafeTickets/actions/workflows/hardhat-unit-tests.yml/badge.svg)
![Vercel Deploy](https://therealsujitk-vercel-badge.vercel.app/?app=safe-tickets)

Final project during [Alyra blockchain developer] training(https://www.alyra.fr/formations/decouvrir-la-formation-developpeur-blockchain-alyra). This is a simple NFT marketplace. NFT's are images and information about physical tickets of passed concert tickets. The target are concert tickets collectors like [Stevie Dixon](https://steviedixon.blogspot.com/p/concerts-venir-lyon-et-region.html).

## Features

As a user I can:

- Authenticate with Rainbowkit
- Create a collection of tickets (rock, rap, whatever)
- Create a ticket draft within a collection with info ([opensea standard](https://docs.opensea.io/docs/metadata-standards)) :
    -  uploaded image (IPFS)
    -  concert name
    -  venue
    -  date
    -  type (= "rareness"; gold|category1|floor)
- Mint a ticket draft within a collection
- Remove a ticket draft
- Set a minted ticket on sale
- Set and update a minted, on sale, ticket's price
- Set a minted ticket "off" sale
- Buy a minted, on sale, price > 0 ticket
- See tickets I bought
- Withdraw my balance on marketplace (after having sold at least one ticket)
- See events of marketplace

## Demo

### Demo video

### Dapp deployment

If application is deployed it should be here: https://safe-tickets.vercel.app

### Contracts on OpenSea and Sepolia 

- [SafeTickets.sol on Opensea](https://testnets.opensea.io/collection/safeticket-1)
- [SafeTickets.sol on Etherscan](https://sepolia.etherscan.io/address/0x8BB9c06cB022cffd6A71D29e6a319828bc685ebD)
- [Markeplace.sol on Etherscan](https://sepolia.etherscan.io/address/0x50f6b938c0f6d77fbaa5f8033933a75f88b5de03)
- [UserCollection.sol on Etherscan](https://sepolia.etherscan.io/address/0xE1B3E1d5a0fd7A01C8a9b94c5825778F667d8CE3)
- [UserCollectionFactory.sol on Etherscan](https://sepolia.etherscan.io/address/0x7CBd2DD300eedf25001E9335F829911994280aD5)

## Contracts architecture

### Contracts

#### Oppenzeppelin contracts dependancy:

- ReentrancyGuard
- IERC721Receiver
- ERC721Enumerable
- ERC721URIStorage
- Clones

#### Description

- UserCollection: 
    - original and "to be cloned" user collection.
    - legacy function `withdraw` (at first I wanted the Collection wich is the owner of the minted tickets to receive the ETH then the user withdraw ETH per collection, it's an unnecessarily cumbersome and complex process.)
    - `initialize` function to initialize collection name
    - other functions from this contract to be called by Marketplace (`approveBuyer`, `transferTicket`)
- UserCollectionFactory:
    - simply clone UserCollection and initialize it
- Marketplace:
    - does the on sale and pricing operation
    - does the buying and transfering operations
    - allow user to withdraw funds on contract
- SafeTickets:
    - mainly the "real" NFT collection 

### Diagram

#### Contract architecture

#### Mint process

![Uploading mi<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4747.8125 3710.46875" width="9495.625" height="7420.9375">
  <!-- svg-source:excalidraw -->

  <defs>
    <style class="style-fonts">
      @font-face {
        font-family: "Virgil";
        src: url("https://excalidraw.com/Virgil.woff2");
      }
      @font-face {
        font-family: "Cascadia";
        src: url("https://excalidraw.com/Cascadia.woff2");
      }
      @font-face {
        font-family: "Assistant";
        src: url("https://excalidraw.com/Assistant-Regular.woff2");
      }
    </style>

  </defs>
  <rect x="0" y="0" width="4747.8125" height="3710.46875" fill="#ffffff"></rect><g stroke-linecap="round" transform="translate(10 10) rotate(0 2363.90625 1845.234375)"><path d="M0 0 C1338.58 -7.62, 2676.01 -6.56, 4727.81 0 M0 0 C1124.01 -11.91, 2247.49 -11.75, 4727.81 0 M4727.81 0 C4733.66 1321.95, 4733.16 2642.19, 4727.81 3690.47 M4727.81 0 C4713.01 1087.65, 4713.44 2176.33, 4727.81 3690.47 M4727.81 3690.47 C3124.66 3701.46, 1520.88 3701.44, 0 3690.47 M4727.81 3690.47 C3366.43 3698.51, 2004.65 3698.71, 0 3690.47 M0 3690.47 C10 2689, 9.66 1688.02, 0 0 M0 3690.47 C-3.55 2220.42, -4.14 749.89, 0 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(128.3326416015625 130.56640624999818) rotate(0 929.611328125 86.07421875)"><text x="0" y="120.64162500000018" font-family="Virgil, Segoe UI Emoji" font-size="137.7187500000002px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Dapp ticket minting process</text></g><g stroke-linecap="round" transform="translate(2232.645929436714 485.90145179416686) rotate(0 261.3179328542349 153.46604355988393)"><path d="M0 0 C110.23 -1.31, 220.43 -1.37, 522.64 0 M0 0 C105.87 -0.32, 211.74 -0.06, 522.64 0 M522.64 0 C520.03 67.08, 522.11 132.1, 522.64 306.93 M522.64 0 C524.39 93.78, 523.48 188.09, 522.64 306.93 M522.64 306.93 C385.66 304.88, 250.09 305.19, 0 306.93 M522.64 306.93 C405.54 308.37, 287.47 308.88, 0 306.93 M0 306.93 C-0.49 208.97, -0.64 110.47, 0 0 M0 306.93 C-1.87 218.59, -1.92 130.52, 0 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(2353.4642742782535 606.0730511825132) rotate(0 140.4995880126953 33.29444417153809)"><text x="140.4995880126953" y="46.66549295082771" font-family="Virgil, Segoe UI Emoji" font-size="53.271110674460864px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Upload file</text></g><g mask="url(#mask-IOA1WoXZyzGHbX31fAYWX)" stroke-linecap="round"><g transform="translate(2767.471504344121 634.0097536872809) rotate(0 412.65501019529177 -0.22044716284244714)"><path d="M0 0 C208.41 -0.72, 417.46 -1.12, 825.31 -0.44 M0 0 C326.44 -1.71, 653.31 -1.26, 825.31 -0.44" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(2767.471504344121 634.0097536872809) rotate(0 412.65501019529177 -0.22044716284244714)"><path d="M801.79 8.04 C806.47 4.83, 812.7 1.95, 825.31 -0.44 M801.79 8.04 C810.37 3.69, 820.07 1.92, 825.31 -0.44" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(2767.471504344121 634.0097536872809) rotate(0 412.65501019529177 -0.22044716284244714)"><path d="M801.84 -9.06 C806.43 -7.94, 812.65 -6.49, 825.31 -0.44 M801.84 -9.06 C810.45 -6.64, 820.14 -1.64, 825.31 -0.44" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask id="mask-IOA1WoXZyzGHbX31fAYWX"><rect x="0" y="0" fill="#fff" width="3692.7815247347044" height="734.4506480129658"></rect><rect x="2933.9392586800377" y="567.2004181813627" fill="#000" width="492.37451171875" height="133.17777668615216" opacity="1"></rect></mask><g transform="translate(2933.9392586800377 567.2004181813627) rotate(0 246.18725585937506 66.22479330526085)"><text x="246.187255859375" y="46.66549295082771" font-family="Virgil, Segoe UI Emoji" font-size="53.271110674460864px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Pinata gives back </text><text x="246.187255859375" y="113.25438129390379" font-family="Virgil, Segoe UI Emoji" font-size="53.271110674460864px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">CID</text></g><g transform="translate(547.6979859553612 586.012669226694) rotate(0 471.50689697265625 133.56692875692534)"><text x="0" y="62.402469115235554" font-family="Virgil, Segoe UI Emoji" font-size="71.2356953370269px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">I. METADATA CREATION</text><text x="0" y="151.44708828651918" font-family="Virgil, Segoe UI Emoji" font-size="71.2356953370269px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">    a. file upload</text><text x="0" y="240.4917074578028" font-family="Virgil, Segoe UI Emoji" font-size="71.2356953370269px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">    b. json creation/upload</text></g><g transform="translate(631.5609495113272 2949.012213002248) rotate(0 1828.972412109375 222.61154792820912)"><text x="0" y="62.402469115235554" font-family="Virgil, Segoe UI Emoji" font-size="71.2356953370269px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">II. MINTING</text><text x="0" y="151.44708828651918" font-family="Virgil, Segoe UI Emoji" font-size="71.2356953370269px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">    a. Call SafeTickets contract #mintTicket(address _collection, string memory _ticketURI)</text><text x="0" y="240.4917074578028" font-family="Virgil, Segoe UI Emoji" font-size="71.2356953370269px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">    b. Remove NFT Draft from local storage</text><text x="0" y="329.5363266290864" font-family="Virgil, Segoe UI Emoji" font-size="71.2356953370269px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">    c. In order to display NFT ticket cards join events and localstorage, in events tickets are tagged</text><text x="0" y="418.58094580037" font-family="Virgil, Segoe UI Emoji" font-size="71.2356953370269px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">    minted true and in localstorage they are tagged minted false</text></g><g stroke-linecap="round"><g transform="translate(1516.948257734508 711.218879779708) rotate(0 350.6902028911072 -41.983014329406615)"><path d="M0 0 C229.61 -27.89, 458.11 -56.18, 701.38 -83.97 M0 0 C198.51 -22.93, 395.92 -46.91, 701.38 -83.97" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(1516.948257734508 711.218879779708) rotate(0 350.6902028911072 -41.983014329406615)"><path d="M679.09 -72.65 C687.79 -75.49, 694.33 -81.43, 701.38 -83.97 M679.09 -72.65 C686.4 -75.61, 691.58 -79.54, 701.38 -83.97" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(1516.948257734508 711.218879779708) rotate(0 350.6902028911072 -41.983014329406615)"><path d="M677.03 -89.63 C686.26 -86.93, 693.47 -87.34, 701.38 -83.97 M677.03 -89.63 C684.78 -87.8, 690.54 -86.94, 701.38 -83.97" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round" transform="translate(3588.1650363147637 519.6556812762828) rotate(0 144.0251626751289 131.94127212934063)"><path d="M145 0 C198.34 52.25, 257.52 101.64, 288.05 132 M145 0 C187.3 38.38, 227.68 75.36, 288.05 132 M288.05 132 C258.55 158.14, 227.32 184.44, 145 263.88 M288.05 132 C243.8 171.04, 200.8 212.34, 145 263.88 M145 263.88 C103.06 227.27, 58.9 186.15, 0 132 M145 263.88 C95.9 220.06, 46.62 174.86, 0 132 M0 132 C29.78 104.38, 58.47 75.76, 145 0 M0 132 C31.05 103.29, 61.77 74.68, 145 0" stroke="#2f9e44" stroke-width="2" fill="none"></path></g><g transform="translate(3667.4167839120937 590.9797656168157) rotate(0 64.76083374023438 60.646551724138135)"><text x="64.76083374023438" y="28.334068965517236" font-family="Virgil, Segoe UI Emoji" font-size="32.34482758620689px" fill="#2f9e44" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">CID + </text><text x="64.76083374023438" y="68.76510344827585" font-family="Virgil, Segoe UI Emoji" font-size="32.34482758620689px" fill="#2f9e44" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">IPFS = </text><text x="64.76083374023438" y="109.19613793103446" font-family="Virgil, Segoe UI Emoji" font-size="32.34482758620689px" fill="#2f9e44" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">URL</text></g><g stroke-linecap="round"><g transform="translate(1520.1528580278382 815.7653121323028) rotate(0 482.3302558894086 253.08837670942467)"><path d="M0 0 C286.3 153.86, 572.11 304.06, 964.66 506.18 M0 0 C300.77 161.14, 602.13 319.28, 964.66 506.18" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(1520.1528580278382 815.7653121323028) rotate(0 482.3302558894086 253.08837670942467)"><path d="M939.87 502.96 C948.43 503.03, 953.22 503.23, 964.66 506.18 M939.87 502.96 C947.76 503.41, 955.83 504.63, 964.66 506.18" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(1520.1528580278382 815.7653121323028) rotate(0 482.3302558894086 253.08837670942467)"><path d="M947.73 487.78 C953.88 492.28, 956.33 497, 964.66 506.18 M947.73 487.78 C953.13 492.9, 958.75 498.86, 964.66 506.18" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g transform="translate(2510.6760451358227 1203.210185694532) rotate(0 896.8681640625 572.0062082101772)"><text x="0" y="44.54021674596579" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">{</text><text x="0" y="108.09646210265214" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">  "image": "ipfs://QmTzC9euDWL7mUGTskDq7KvatvEG65iwjwENSzkezuiF",</text><text x="0" y="171.6527074593385" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">  "attributes": [</text><text x="0" y="235.20895281602486" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">    {</text><text x="0" y="298.7651981727112" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">      "value": "Massive attack 1998"</text><text x="0" y="362.3214435293975" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">    },</text><text x="0" y="425.8776888860839" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">    {</text><text x="0" y="489.43393424277025" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">      "trait_type": "Concert date",</text><text x="0" y="552.9901795994566" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">      "display_type": "date",       </text><text x="0" y="616.546424956143" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">      "value": timestamp</text><text x="0" y="680.1026703128293" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">    },</text><text x="0" y="743.6589156695157" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">    {</text><text x="0" y="807.215161026202" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">      "trait type": "Ticket category",</text><text x="0" y="870.7714063828885" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">      "value": "golden"</text><text x="0" y="934.3276517395748" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">    }</text><text x="0" y="997.8838970962612" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">  ]</text><text x="0" y="1061.4401424529474" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">}</text><text x="0" y="1124.996387809634" font-family="Virgil, Segoe UI Emoji" font-size="50.84499628534908px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic"></text></g><g mask="url(#mask-9nOgljQx8Cqrm6gUrOeYi)" stroke-linecap="round"><g transform="translate(3671.1700538506957 757.9086055758708) rotate(0 -186.27519270035805 214.3927476890899)"><path d="M0 0 C-126.74 143.41, -249.77 285.78, -372.55 428.79 M0 0 C-79.97 91.33, -160.15 183.41, -372.55 428.79" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(3671.1700538506957 757.9086055758708) rotate(0 -186.27519270035805 214.3927476890899)"><path d="M-363.63 405.43 C-368.64 414.99, -367.81 420.33, -372.55 428.79 M-363.63 405.43 C-366 410.99, -367.78 415.33, -372.55 428.79" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(3671.1700538506957 757.9086055758708) rotate(0 -186.27519270035805 214.3927476890899)"><path d="M-350.71 416.63 C-359.94 422.38, -363.44 423.98, -372.55 428.79 M-350.71 416.63 C-355.89 419.67, -360.45 421.59, -372.55 428.79" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask id="mask-9nOgljQx8Cqrm6gUrOeYi"><rect x="0" y="0" fill="#fff" width="4143.720439251412" height="1286.6941009540506"></rect><rect x="3356.5429019218227" y="954.8013532649602" fill="#000" width="256.70391845703125" height="35" opacity="1"></rect></mask><g transform="translate(3356.5429019218222 954.8013532649602) rotate(0 128.35195922851562 17.500000000000455)"><text x="128.35195922851562" y="24.528" font-family="Virgil, Segoe UI Emoji" font-size="28px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">image url = "image"</text></g><g stroke-linecap="round" transform="translate(963.7027882272009 2438.670051438448) rotate(0 541.3839581615005 73.7808456919613)"><path d="M0 0 C299.27 -0.19, 600.16 -0.92, 1082.77 0 M0 0 C261.15 -2.43, 522.09 -2.18, 1082.77 0 M1082.77 0 C1081.19 44.2, 1083.54 89.2, 1082.77 147.56 M1082.77 0 C1082.6 37.09, 1081.03 71.41, 1082.77 147.56 M1082.77 147.56 C811.83 146.93, 541.52 146.64, 0 147.56 M1082.77 147.56 C790.51 149.44, 497.08 148.74, 0 147.56 M0 147.56 C-1.94 90.28, 0.78 29.08, 0 0 M0 147.56 C-1.48 116.91, -1.26 87.01, 0 0" stroke="#f08c00" stroke-width="2" fill="none"></path></g><g transform="translate(1210.6248628437795 2494.950897130409) rotate(0 294.4618835449219 17.5)"><text x="294.4618835449219" y="24.528" font-family="Virgil, Segoe UI Emoji" font-size="28px" fill="#f08c00" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">STORE NFT DRAFT ON LOCAL STORAGE</text></g><g stroke-linecap="round"><g transform="translate(2500.2270875915938 1938.799009772778) rotate(0 -381.21171613082174 -63.62519160391639)"><path d="M0 0 C-175.11 -31.15, -349.38 -60.07, -762.42 -127.25 M0 0 C-258.32 -43.5, -516.37 -86.74, -762.42 -127.25" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(2500.2270875915938 1938.799009772778) rotate(0 -381.21171613082174 -63.62519160391639)"><path d="M-737.85 -131.85 C-743.99 -132.68, -747.86 -130.92, -762.42 -127.25 M-737.85 -131.85 C-747.05 -130.49, -755.1 -129.32, -762.42 -127.25" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(2500.2270875915938 1938.799009772778) rotate(0 -381.21171613082174 -63.62519160391639)"><path d="M-740.64 -114.98 C-746.12 -119.67, -749.34 -121.78, -762.42 -127.25 M-740.64 -114.98 C-748.83 -119.33, -755.94 -123.87, -762.42 -127.25" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g mask="url(#mask-ze0kJkuY4bOVwTgXwy_QP)" stroke-linecap="round"><g transform="translate(1231.5252980178927 2611.747814059768) rotate(0 -79.88712524377206 129.33679933378903)"><path d="M0 0 C-48.65 77.41, -95.92 156.27, -159.77 258.67 M0 0 C-40.31 64.41, -79.5 128.8, -159.77 258.67" stroke="#f08c00" stroke-width="2" fill="none"></path></g><g transform="translate(1231.5252980178927 2611.747814059768) rotate(0 -79.88712524377206 129.33679933378903)"><path d="M-154.72 234.19 C-157.7 241.88, -157.72 250.07, -159.77 258.67 M-154.72 234.19 C-156.42 239.87, -156.91 246.03, -159.77 258.67" stroke="#f08c00" stroke-width="2" fill="none"></path></g><g transform="translate(1231.5252980178927 2611.747814059768) rotate(0 -79.88712524377206 129.33679933378903)"><path d="M-140.16 243.17 C-147.59 248, -152.02 253.47, -159.77 258.67 M-140.16 243.17 C-145.47 246.66, -149.59 250.59, -159.77 258.67" stroke="#f08c00" stroke-width="2" fill="none"></path></g></g><mask id="mask-ze0kJkuY4bOVwTgXwy_QP"><rect x="0" y="0" fill="#fff" width="1491.2995485054369" height="2970.4214127273463"></rect><rect x="1044.146206526562" y="2723.5846133935574" fill="#000" width="214.9839324951172" height="35" opacity="1"></rect></mask><g transform="translate(1044.146206526562 2723.5846133935574) rotate(0 107.4919662475586 17.499999999999773)"><text x="107.4919662475586" y="24.528" font-family="Virgil, Segoe UI Emoji" font-size="28px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">MINT BUTTON</text></g><g stroke-linecap="round" transform="translate(1200.30695190129 1630.882743217262) rotate(0 261.317932854235 153.46604355988393)"><path d="M0 0 C131.09 -1.29, 262.56 -1.02, 522.64 0 M0 0 C192.66 -0.63, 385.72 -0.36, 522.64 0 M522.64 0 C525.43 99.55, 523.69 197.46, 522.64 306.93 M522.64 0 C525.18 89.14, 525.39 179.09, 522.64 306.93 M522.64 306.93 C406.17 306.22, 288.98 306.49, 0 306.93 M522.64 306.93 C344.32 306.01, 166.65 306.57, 0 306.93 M0 306.93 C2.19 199.71, 1.9 91.6, 0 0 M0 306.93 C2.2 185.35, 2.53 62.67, 0 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(1321.1252967428295 1751.0543426056079) rotate(0 140.4995880126953 33.29444417153809)"><text x="140.4995880126953" y="46.66549295082771" font-family="Virgil, Segoe UI Emoji" font-size="53.271110674460864px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Upload file</text></g><g mask="url(#mask-bYND_HXLbR5Ze32mIqGlu)" stroke-linecap="round"><g transform="translate(1502.9305879288693 1963.5136198389741) rotate(0 -75.0237698032389 234.1642401303252)"><path d="M0 0 C-47.53 151.15, -96.79 302.57, -150.05 468.33 M0 0 C-38.03 123.55, -77.38 246.66, -150.05 468.33" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(1502.9305879288693 1963.5136198389741) rotate(0 -75.0237698032389 234.1642401303252)"><path d="M-150.89 443.34 C-149.57 451.12, -151.02 458.97, -150.05 468.33 M-150.89 443.34 C-151.19 450.27, -150.48 456.05, -150.05 468.33" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(1502.9305879288693 1963.5136198389741) rotate(0 -75.0237698032389 234.1642401303252)"><path d="M-134.63 448.65 C-138.59 454.64, -145.3 460.78, -150.05 468.33 M-134.63 448.65 C-139.27 454.17, -142.85 458.55, -150.05 468.33" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask id="mask-bYND_HXLbR5Ze32mIqGlu"><rect x="0" y="0" fill="#fff" width="1752.978127535347" height="2531.8421000996245"></rect><rect x="1181.7195622662553" y="2097.794527454685" fill="#000" width="492.37451171875" height="199.76666502922825" opacity="1"></rect></mask><g transform="translate(1181.7195622662553 2097.794527454685) rotate(0 246.1872558593751 99.88333251461427)"><text x="246.187255859375" y="46.66549295082771" font-family="Virgil, Segoe UI Emoji" font-size="53.271110674460864px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Pinata gives back </text><text x="246.187255859375" y="113.25438129390379" font-family="Virgil, Segoe UI Emoji" font-size="53.271110674460864px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">ipfs://xyz = </text><text x="246.187255859375" y="179.84326963697987" font-family="Virgil, Segoe UI Emoji" font-size="53.271110674460864px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">_ticketURI</text></g></svg>ntProcess.svg…]()

### Contracts deployment

- UserCollection & SafeTickets dont take constructor args
- Marketplace needs:
    - SafeTickets address
- UserCollectionFactory needs:
    - UserCollection address
    - SafeTickets address
    - Marketplace address

## Coverage & security

### Coverage

A coverage screen 08-04-24 15:00.


### Slither

Slither does not pass, some warnings are from Openzeppelin contracts. Other need a timely refacto. Here is a screen of Slither report launched within a GitHub workflow action.

## Stack

### Smartcontract

- Solidity
- Hardhat
- Slither
- Sepolia

### File upload

- IPFS, Pinata

### Front

- Wagmi, Viem, Rainbowkit, NextJS
- Chakra-UI
- localStorage

### CI/CD

- Hardhat tests (+ Mocha & Chai)
- GitHub actions
- Slither
- Vercel

## Dapp

- should be mostly responsive
- handle empty states
    - no buyings
    - no ticket on sale
- use serverless functions to get data from blockchain in `app/api/*` 

## Important issues

- [Better contract DocGen](https://github.com/beubeubeubeu/SafeTickets/issues/5)
- [Better transaction confirmation UX](https://github.com/beubeubeubeu/SafeTickets/issues/18)
- [Fix all Slither fixable warnings](https://github.com/beubeubeubeu/SafeTickets/issues/20)

## Run the app locally

### Run front

```sh
cd ./frontend
yarn install
touch .env.local
yarn run dev
```
.env.local:
```sh
NEXT_PUBLIC_NETWORK=hardhat
NEXT_PUBLIC_ENABLE_TESTNETS=true
NEXT_PUBLIC_EVENT_BLOCK_NUMBER=0
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID={REPLACE}
NEXT_PUBLIC_PINATA_GATEWAY_URL={REPLACE}
PINATA_JWT={REPLACE}
// hardhat local invariable addresses:
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
NEXT_PUBLIC_SAFE_TICKETS_CONTRACT_ADDRESS="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
NEXT_PUBLIC_USER_COLLECTION_CONTRACT_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
NEXT_PUBLIC_USER_COLLECTION_FACTORY_CONTRACT_ADDRESS="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
```

### Run blockchain

```sh 
cd ./blockchain
touch .env
yarn install
yarn hardhat run --network hardhat
```

.env

```sh
LOCAL=true
INFURA_PK={REPLACE}
ETHERSCAN_API_KEY={REPLACE}
INFURA_URL={REPLACE}
WALLET_PK={REPLACE}
ALCHEMY_URL={REPLACE}
```

### Deploy

```sh
yarn hardhat run scripts/deploy.js --network localhost
```

to Sepolia

```sh
yarn hardhat run scripts/deploy.js --network sepolia
```
