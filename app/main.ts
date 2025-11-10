import * as net from "net";
import { Resp } from "./packages/common/Resp"
import Base from "@base";
import List from "@list";
import { eventEmitter } from "./packages/persistence/events";
import { type } from "./packages/commands/type";
import { xAdd } from "./packages/commands/xadd";
import { xRange } from "./packages/commands/xrange";

let socketId = 1;

const server = net.createServer((socket: net.Socket & {socketId?: number}) => {

  socket.socketId = socketId
  socketId++;

  socket.on("data", data => {
    const commands = Resp(data.toString());

    commands.forEach(command => {
      const commandName = command[0];

      if (commandName === "PING") 
        return socket.write(Base.ping());

      if (commandName === "ECHO") 
        return socket.write(Base.echo({ value: command[1] }));

      if (commandName === "GET")
        return socket.write(Base.get({ key: command[1] }));

      if (commandName === "SET") {
        return socket.write(Base.set({
          key: command[1],
          value: command[2],
          px: command[3],
          expiryTime: command[4]
        }))
      }

      if (commandName === "RPUSH") {
        const [_, key, ...value] = command;
        return socket.write(List.rpush({ key, value }));
      }

      if (commandName === "LPUSH") {
        const [_, key, ...value] = command;
        return socket.write(List.lpush({ key, value }));
      }

      if (commandName === "LRANGE") {
        const [_, key, start, end] = command;
        return socket.write(List.lrange({ key, start, end }))
      }
      
      if (commandName === "LLEN") 
        return socket.write(List.llen({ key: command[1] }))

      if (commandName === "LPOP") {
        const[_, key, quantity] = command;
        return socket.write(List.lpop({ key, quantity }));
      }
      
      if (commandName === "BLPOP") {
        const[_, key, timeout] = command;
        List.blpop({ key, timeout, socketId: socket.socketId!})
        .then(res => socket.write(res));
        return
      }
      
      if (commandName === "TYPE") {
        const [_, key] = command;
        socket.write(type({key}));
      }

      if (commandName === "XADD") {
        const [_, key, id, ...entriesArray] = command;
        socket.write(xAdd({key, id, entries: entriesArray}))
      }

      if (commandName === "XRANGE") {
        const [_, key, start, end] = command;
        socket.write(xRange({ key, start, end }))
      }
    })
  })

  socket.on("close", () => {
    const socketBlpopListener = List.blpopListeners.get(socket.socketId!);
    if(!socketBlpopListener) return;
    eventEmitter.off("ELEMENT_ADDED", socketBlpopListener);
  })
});


server.listen(6380, "127.0.0.1");


