# The 4541 TASER Bot
TASER Discord Bot Code Collection

The TASER bot is a discord bot that is connected to our team discord server. This allows for integration between our discord and TASER systems allowing easier and more secure access to data for our team members.

****

# Contributions / Terms

All contributions / updates, like in the main TASER repository, should follow all terms associated with the TASER system of applications AND all the contribution guidelines expressed in the TASER contribution documentation.

**Note: All changes must be made, after v1.0.0, to the TypeScript file!** No JavaScript should be edited, the compiler will update it automatically.

****

# Getting Started

## Environmental Variables Setup

This project utilizes environmental variables in order to change the applications functionality. All environmental variables must be setup in order to run this application. All variables need to be in a `.env` file located in the `/server/JS` directory.

This environmental variables that need to be setup include: FIREBASE_KEY and TOKEN.

The TOKEN is the discord bot API token while the FIREBASE_KEY is the firebase admin key used to access the TASER database.

**If you wish to contribute to this repository please contact the 4541 Cavineers head of controls to get access to the correct environmental variables, otherwise any discord token and db will work for smaller testing and development.**

## Cloning and Starting Compilers

After reading all the guidelines of this repository, simply run `npm run dev` after cloning the repository to start up both the service and the compiler. The web app GUI starts on port `8000`.

Once again, all updates must be made to the TypeScript files.
