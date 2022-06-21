//import { execaCommand } from "execa";

const { database } = require('../../database/config/index');

//const { execa } = await import("execa");

const miner = async (req, res) => {
  const { url } = req.body;
  const execaCommand = (await import('execa')).execaCommand;
  const command = "python3 ../../../miner/MineBySearch.py 0 "+url;
  const { stdout } = execaCommand(command);
  console.log({ stdout });// Code which uses `execa` here.
}

module.exports = {
  miner
}