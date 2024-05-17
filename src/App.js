import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './App.module.css';
import io from 'socket.io-client';
import Character from './components/charLoader';
import { map, set } from 'lodash';


const imagesContext = require.context('./components/TILES_WALLS', false, /\.png$/);



const socket = io.connect("http://localhost:3001");
/* https://projectrpbackendapi.loca.lt */
/* http://localhost:3001 */

function App() {
  const [floordecal, setFloorDecal] = useState(false);
  const [images, setImages] = useState([]);
  const [menuLocation, setMenuLocation] = useState([-10, -10, 'target', 'targettype']);
  const [playing, setPlaying] = useState(true);
  const [direction, setDirection] = useState('top');
  const [isMoving, setIsMoving] = useState(false);
  const [target, setTarget] = useState({ Type: 'player', Name: 'target', Action: 'follow' });
  const mapFullRef = useRef();
  const playersRef = useRef([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState([0, 0]);
  const [Npcs, setNpcs] = useState([]);
  const npcsRef = useRef([]);
  const [mapFloors, setMapFloors] = useState([]);
  const [mapOthers, setMapOthers] = useState([]);
  const [mapWalls, setMapWalls] = useState([]);
  const [mapFloorDecals, setMapFloorDecals] = useState([]);
  const [wallrotate, setWallRotate] = useState(0);
  const [lastDamage, setLastDamage] = useState(0);
  const [lastDamageReceived, setLastDamageReceived] = useState(0);
  const [mapItems, setMapItems] = useState([]);
  const [placeFloor, setPlaceFloor] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');
  const [placeDecor, setPlaceDecor] = useState(false);
  const [newDecorName, setNewDecorName] = useState('');
  const [placeWalls, setPlaceWalls] = useState(false);
  const [newWallName, setNewWallName] = useState('');
  const [newMapName, setNewMapName] = useState('');
  const [mapName, setMapName] = useState("");
  const [logged, setLogged] = useState(false);

  const [messageReceived, setMessageReceived] = useState("");
  const [invLogged, setInvLogged] = useState([]);
  const invLoggedRef = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [playersLoggedInfo, setPlayersLoggedInfo] = useState([]);
  const [loggedAccount, setLoggedAccount] = useState({
    position: [0, 0],
    map: "Vila_Inicial",
    inventory: [],
    atributes: {
      strength: 0,
      dexterity: 0,
      intelligence: 0,
      charisma: 0,
      constitution: 0,
      wisdom: 0,
      movespeed: 3
    },
    equipped: {
      head: null,
      chest: null,
      legs: null,
      feet: null,
      rightHand: null,
      leftHand: null,
      ring: null,
      necklace: null
    },
    health: 10,
    maxHealth: 10,
    mana: 10,
    maxMana: 10,
    level: 1

  })
  const [players, setPlayers] = useState([]);
  const [prevPlayers, setPrevPlayers] = useState([]);
  const [canMove, setCanMove] = useState(true);
  const [equipStats, setEquipStats] = useState({
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    charisma: 0,
    constitution: 0,
    wisdom: 0,
    movespeed: 0,
    atkRange: 0
  })
  const [playerPosition, setPlayerPosition] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [showMessageDmgReceived, setShowMessageDmgReceived] = useState(false);


  useEffect(() => {
    const loadImages = () => {
      const keys = imagesContext.keys();
      const images = keys.map(key => ({
        src: imagesContext(key),
        name: key.substring(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
      }));
      setImages(images);
    };

    loadImages();
  }, []);

  const checkPlayerMovement = useCallback(() => {
    players.forEach((player, index) => {
      if (JSON.stringify(player.position) !== JSON.stringify(prevPlayers[index]?.position)) {
        setPrevPlayers(playersRef.current);
        const checkX = player.position[0] - prevPlayers[index]?.position[0];
        const checkY = player.position[1] - prevPlayers[index]?.position[1];
        let isPlayerMoving = false;
        let checkDirection = '';
        if (checkX === 1) {
          checkDirection = 'right';
          isPlayerMoving = true;
        }
        if (checkX === -1) {
          checkDirection = 'left';
          isPlayerMoving = true;
        }
        if (checkY === 1) {
          checkDirection = 'down';
          isPlayerMoving = true;
        }
        if (checkY === -1) {
          checkDirection = 'top';
          isPlayerMoving = true;
        }


        setPlayerPosition(prevPlayerPosition => {
          // Remove any existing entries for the current player
          const updatedPlayerPositions = prevPlayerPosition.filter(p => p.username !== player.username);

          // Add a new entry for the current player
          updatedPlayerPositions.push({ username: player.username, direction: checkDirection, moving: isPlayerMoving });

          if (isPlayerMoving) {
            setTimeout(() => {
              const playerIndex = updatedPlayerPositions.findIndex(p => p.username === player.username);
              if (playerIndex !== -1) {
                updatedPlayerPositions[playerIndex].moving = false;
                setPlayerPosition(updatedPlayerPositions);
              }
            }, 1000 / player.atributes.movespeed);
          }
          return updatedPlayerPositions;
        });
      }
    });
  }, [players, prevPlayers, playersRef]);

  useEffect(() => {
    if (logged) {
      let strength = 0;
      let dexterity = 0;
      let intelligence = 0;
      let charisma = 0;
      let constitution = 0;
      let wisdom = 0;
      let movespeed = 0;
      let atkRange = 0;

      // Loop over all equipped items
      for (let item in loggedAccount.equipped) {
        if (loggedAccount.equipped[item]) {
          // If the item is not null, add its stats to the total stats
          strength += loggedAccount.equipped[item].strength || 0;
          dexterity += loggedAccount.equipped[item].dexterity || 0;
          intelligence += loggedAccount.equipped[item].intelligence || 0;
          charisma += loggedAccount.equipped[item].charisma || 0;
          constitution += loggedAccount.equipped[item].constitution || 0;
          wisdom += loggedAccount.equipped[item].wisdom || 0;
          movespeed += loggedAccount.equipped[item].movespeed || 0;
          atkRange += loggedAccount.equipped[item].atkRange || 0;
        }
      }

      setEquipStats({
        strength: strength,
        dexterity: dexterity,
        intelligence: intelligence,
        charisma: charisma,
        constitution: constitution,
        wisdom: wisdom,
        movespeed: movespeed,
        atkRange: atkRange
      })

    }
  }, [loggedAccount, logged]);

  useEffect(() => {

    setPlayers(playersRef.current);
  }, [playersRef.current]);

  useEffect(() => {
    checkPlayerMovement();
  }, [checkPlayerMovement]);

  const [lastAttackTime, setLastAttackTime] = useState(true);

  const RunSimpleAttack = (attacker, target) => {
    const damage =
      (attacker?.atributes?.strength + equipStats.strength)
      +
      (attacker?.atributes?.dexterity + equipStats.dexterity) * 2
      +
      (attacker?.atributes?.intelligence + equipStats.intelligence) * 2;

    const defense = target.atributes.constitution * 2;
    let newTargetInfo = { ...target };

    if (damage > defense) {
      console.log(`${attacker.username} attacked ${target.username} for ${damage - defense} damage`);
      newTargetInfo.health -= damage - defense;
      if (newTargetInfo.health <= 0) {
        newTargetInfo.health = 0;
        setTarget({ Type: '', Name: '', Action: '' });
      }
      socket.emit("forceinteraction", { account: newTargetInfo, type: 'Attack' });
      setLastDamage(damage - defense);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);

    }
  }

  const RunSimpleAttackMonster = (attacker, target) => {

    const damage =
      (attacker?.atributes?.strength + equipStats.strength)
      +
      (attacker?.atributes?.dexterity + equipStats.dexterity) * 2
      +
      (attacker?.atributes?.intelligence + equipStats.intelligence) * 2;
    const defense = 5;
    /* target.atributes.constitution  */

    let newTargetInfo = { ...target };

    if (damage > defense) {

      let calculatedDamage = damage - defense;
      let minDamage = calculatedDamage / 2;
      let randomDamage = Math.floor(Math.random() * (calculatedDamage - minDamage + 1)) + minDamage;
      newTargetInfo.health -= randomDamage;
      if (newTargetInfo.health <= 0) {
        newTargetInfo.health = 0;
        setTarget({ Type: '', Name: '', Action: '' });
      }


      socket.emit("forceinteractionMonster", {
        account: newTargetInfo, type: 'Attack',
        attackType: 'basic_attack', attacker: attacker.username, attackerPosition: attacker.position
      });
      setLastDamage(randomDamage);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);

    }
  }

  const RunSimpleFullHeal = (target) => {

    let newTargetInfo = { ...target };
    newTargetInfo.health = newTargetInfo.maxHealth;


    socket.emit("forceinteraction", { account: newTargetInfo, type: 'Attack' });


  }

  useEffect(() => {
    if (target.Type === 'player' && target.Action === 'follow' &&
      target.Name && logged &&
      playersRef.current.find(player => player.username === target.Name) && canMove) {
      const intervalId = setInterval(() => {
        const theplayer = playersRef.current.find(player => player.username === target.Name);
        setLoggedAccount(prev => {
          let newPosition = [...prev.position];
          const dx = theplayer.position[0] - prev.position[0];
          const dy = theplayer.position[1] - prev.position[1];

          if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {

            return prev;
          }

          if (Math.abs(dx) > Math.abs(dy)) {
            // Move horizontally
            if (dx > 0) {
              newPosition[0] = Math.min(9999, newPosition[0] + 1);
              setDirection('right');
            } else {
              newPosition[0] = Math.max(0, newPosition[0] - 1);
              setDirection('left');
            }
          } else {
            // Move vertically
            if (dy > 0) {
              newPosition[1] = Math.min(9999, newPosition[1] + 1);
              setDirection('down');
            } else {
              newPosition[1] = Math.max(0, newPosition[1] - 1);
              setDirection('top');
            }
          }

          setIsMoving(true);

          const floorExists = mapFloors.some(floor => floor.X === newPosition[0] && floor.Y === newPosition[1]);
          if (!floorExists) {
            return prev;
          }

          setCanMove(false);

          setTimeout(() => {
            setCanMove(true)
            setIsMoving(false);
          }, 1000 / prev.atributes.movespeed);
          return { ...prev, position: newPosition };
        });
      }, 1000 / loggedAccount.atributes.movespeed);

      return () => clearInterval(intervalId);
    }

    if (target.Type === 'player' && target.Action === 'attack' &&
      target.Name && logged &&
      playersRef.current.find(player => player.username === target.Name) && canMove) {
      const intervalId = setInterval(() => {
        const theplayer = playersRef.current.find(player => player.username === target.Name);
        setLoggedAccount(prev => {
          if (!theplayer) {
            setTarget({ Type: '', Name: '', Action: '' });
            return prev;
          }
          let newPosition = [...prev.position];
          const dx = theplayer.position[0] - prev.position[0];
          const dy = theplayer.position[1] - prev.position[1];
          if (Math.abs(dx) <= prev.atributes.attackRange && Math.abs(dy) <= prev.atributes.attackRange) {


            if (lastAttackTime) {

              setLastAttackTime(false);
              RunSimpleAttack(prev, theplayer);
              setTimeout(() => {
                setLastAttackTime(true);
              }, 3000 / (prev.atributes.dexterity + 1));
            }


            return prev;
          }


          if (Math.abs(dx) > Math.abs(dy)) {
            // Move horizontally
            if (dx > 0) {
              newPosition[0] = Math.min(9999, newPosition[0] + 1);
              setDirection('right');
            } else {
              newPosition[0] = Math.max(0, newPosition[0] - 1);
              setDirection('left');
            }
          } else {
            // Move vertically
            if (dy > 0) {
              newPosition[1] = Math.min(9999, newPosition[1] + 1);
              setDirection('down');
            } else {
              newPosition[1] = Math.max(0, newPosition[1] - 1);
              setDirection('top');
            }
          }

          setIsMoving(true);

          const floorExists = mapFloors.some(floor => floor.X === newPosition[0] && floor.Y === newPosition[1]);
          if (!floorExists) {
            return prev;
          }

          setCanMove(false);

          setTimeout(() => {
            setCanMove(true)
            setIsMoving(false);
          }, 1000 / prev.atributes.movespeed);
          return { ...prev, position: newPosition };
        });
      }, 1000 / loggedAccount.atributes.movespeed);


      return () => clearInterval(intervalId);
    }

    if (target.Type === 'monster' && target.Action === 'attack' &&
      target.Name && logged &&
      npcsRef.current.find(player => player.Name === target.Name) && canMove) {
      const intervalId = setInterval(() => {
        const theplayer = npcsRef.current.find(player => player.Name === target.Name);


        setLoggedAccount(prev => {
          if (!theplayer) {
            setTarget({ Type: '', Name: '', Action: '' });
            return prev;
          }
          let newPosition = [...prev.position];
          const dx = theplayer.X - prev.position[0];
          const dy = theplayer.Y - prev.position[1];
          if (Math.abs(dx) <= prev.atributes.attackRange && Math.abs(dy) <= prev.atributes.attackRange) {


            if (lastAttackTime) {

              setLastAttackTime(false);
              RunSimpleAttackMonster(prev, theplayer);
              setTimeout(() => {
                setLastAttackTime(true);
              }, 3000 / (prev.atributes.dexterity + 1));
            }


            return prev;
          }


          if (Math.abs(dx) > Math.abs(dy)) {
            // Move horizontally
            if (dx > 0) {
              newPosition[0] = Math.min(9999, newPosition[0] + 1);
              setDirection('right');
            } else {
              newPosition[0] = Math.max(0, newPosition[0] - 1);
              setDirection('left');
            }
          } else {
            // Move vertically
            if (dy > 0) {
              newPosition[1] = Math.min(9999, newPosition[1] + 1);
              setDirection('down');
            } else {
              newPosition[1] = Math.max(0, newPosition[1] - 1);
              setDirection('top');
            }
          }

          setIsMoving(true);

          const floorExists = mapFloors.some(floor => floor.X === newPosition[0] && floor.Y === newPosition[1]);
          if (!floorExists) {
            return prev;
          }

          setCanMove(false);

          setTimeout(() => {
            setCanMove(true)
            setIsMoving(false);
          }, 1000 / prev.atributes.movespeed);
          return { ...prev, position: newPosition };
        });
      }, 1000 / loggedAccount.atributes.movespeed);


      return () => clearInterval(intervalId);
    }
  }, [target, loggedAccount, canMove, lastAttackTime]);



  /* WASD MOVEMENT */




  const handleKeyDown = useCallback((event) => {
    if (!canMove || !['w', 'a', 's', 'd'].includes(event.key)) {
      return;
    }

    setLoggedAccount(prev => {
      let newPosition = [...prev.position];
      switch (event.key) {
        case 'w':
          newPosition[1] = Math.max(0, newPosition[1] - 1);
          setDirection('top');
          setIsMoving(true);
          break;
        case 'a':
          newPosition[0] = Math.max(0, newPosition[0] - 1);
          setDirection('left');
          setIsMoving(true);
          break;
        case 's':
          newPosition[1] = Math.min(9999, newPosition[1] + 1);
          setDirection('down');
          setIsMoving(true);
          break;
        case 'd':
          newPosition[0] = Math.min(9999, newPosition[0] + 1);
          setDirection('right');
          setIsMoving(true);
          break;
        default:
          break;
      }
      const floorExists = mapFloors.some(floor => floor.X === newPosition[0] && floor.Y === newPosition[1]);
      if (!floorExists) {
        return prev;
      }

      setCanMove(false);

      setTimeout(() => {
        setCanMove(true)
        setIsMoving(false);
      }, 1000 / prev.atributes.movespeed);
      return { ...prev, position: newPosition };
    });
  }, [canMove, mapFloors]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  /*  */




  const submitLogin = useCallback((e) => {
    e.preventDefault();
    socket.emit("loginacc", { username: username, password: password, email: email });
    setUsername("");
    setPassword("");
    setEmail("");
  }, [username, password, email]);

  const submitCreateAcc = useCallback((e) => {
    e.preventDefault();
    socket.emit("createacc", { username: username, password: password, email: email });
    setUsername("");
    setPassword("");
    setEmail("");
  }, [username, password, email]);


  function stackItems(items) {
    const stackedItems = [];

    items.forEach(item => {
      if (item.stackable) {
        const existingItem = stackedItems.find(i => i.object.name === item.name);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          stackedItems.push({ object: item, quantity: 1 });
        }
      } else {
        stackedItems.push({ object: item, quantity: 1 });
      }
    });

    return stackedItems;
  }

  /* Receive data */

  useEffect(() => {
    /* RECEIVE PLAYERS DATA */
    socket.on("receive_message", (data) => {
      if (logged) {

        setPlayersLoggedInfo(data.data);
        playersRef.current = data.data;


      }

    });
    socket.on("items_changed", (data) => {
      if (logged && mapName === data.map) {

        setMapItems(data.data);


      }

    });

    socket.on("attacking_Player", (data) => {
      if (data.playerTarget === loggedAccount.username) {

        if (data.damage > 0) {
          console.log('Took a hit from something!')
          setLoggedAccount(prevState => {
            prevState.health -= data.damage;
            return { ...prevState };
          });
        }

      }
    });
    socket.on("npcs_changed", (data) => {
      if (logged && mapName === data.map) {

        let npcarray = [...npcsRef.current];
        let newNpc = data.data;
        let npcIndex = npcarray.findIndex(npc => npc.Name === newNpc.Name);
        if (npcIndex !== -1) {
          npcarray[npcIndex] = newNpc;
        } else {
          npcarray.push(newNpc);
        }
        setNpcs(npcarray);
        npcsRef.current = npcarray;
      }

    });


    socket.on("interacted", (data) => {
      if (logged) {

        setLoggedAccount(prevState => ({ ...prevState, ...data.data }));

        if (data.data.health === 0) {
          let respawnCharacter = { ...data.data };
          respawnCharacter.health = respawnCharacter.maxHealth;
          respawnCharacter.position = [1, 4];
          respawnCharacter.map = "Vila_Inicial";
          socket.emit("updateacc", { account: respawnCharacter });
          socket.emit("disconnectuser");

          setLogged(false);
          window.location.reload();
        }



      }

    });


    /*  */


    /* CREATE ACCOUNT */
    socket.on("createacc_response", (data) => {
      if (data.success) {
        setMessageReceived(data.message);


        setLoggedAccount(prevState => ({ ...prevState, ...data.account }));


      } else {
        setMessageReceived(data.message);

      }
    });
    /* LOGIN ACCOUNT */
    socket.on("loginacc_response", (data) => {
      if (data.success) {

        setMessageReceived(data.message);


        setLoggedAccount(prevState => ({ ...prevState, ...data.account }));


      } else {
        setMessageReceived(data.message);

      }
    });



    /* CHECK LOGGED ACCOUNTS */

    socket.on('check_logged_in_response', (data) => {
      if (data.isLoggedIn) {
        setLogged(true);
      } else {
        setLogged(false);
      }
    });


    socket.on('map_data', (data) => {
      if (data) {
        setMapName(data);
      }
    });
    socket.on('receive_mapfloors', (data) => {
      if (data) {
        setMapFloors(data.data);
        setMapOthers(data.decor);
        setMapWalls(data.walls);
        setMapFloorDecals(data.floordecal);
      }

    });
    if (logged) {

      socket.on('receive_items', (data) => {
        const stackedItems = stackItems(data.data);
        if (JSON.stringify(stackedItems) !== JSON.stringify(invLoggedRef.current)) {

          setInvLogged(stackedItems);

          invLoggedRef.current = stackedItems;
        }
      });
      socket.on('receive_npcs', (data) => {
        setNpcs(data.data);
        npcsRef.current = data.data;
      });
    }



  }, [socket, logged, mapName]);
  /*  */

  /* Get User Map */

  useEffect(() => {
    if (logged && mapName) {
      socket.emit("getmap", { mapname: mapName });
    }
  }, [mapName, logged])



  /*  */



  /* Check if user is logged */

  useEffect(() => {
    if (logged && loggedAccount?.username) {

      socket.emit("updateacc", { account: loggedAccount });
      socket.emit("getItems", { inventory: loggedAccount.inventory });

    }

    const sendLoggedAccount = () => {

      socket.emit('check_logged_in', loggedAccount);
    };


    sendLoggedAccount();

    const intervalId = setInterval(sendLoggedAccount, 5000);


    return () => {
      clearInterval(intervalId);
    };
  }, [loggedAccount, logged]);
  /*  */




  /* Salvar mapa */

  const saveMap = useCallback(() => {
    const namemap = newMapName;
    const floorsmap = mapFloors;
    socket.emit("createmapfloor", {
      mapname: namemap, floors: floorsmap,
      walls: mapWalls, decor: mapOthers, decal: mapFloorDecals
    });
    console.log(mapFloorDecals)
    console.log(mapWalls)
  }, [newMapName, mapFloors]);


  /*  */

  /* Add item to the map */

  const addItemToMap = useCallback((newItem, positionX, positionY) => {
    const namemap = mapName;

    let addItemToArray = [...mapItems, { newItem, positionX, positionY }];

    setMapItems([...addItemToArray]);
    socket.emit("createmapitem", { mapname: namemap, item: addItemToArray });

    setLoggedAccount(prevState => {
      const index = prevState.inventory.findIndex(item => item === newItem);
      if (index !== -1) {
        // Create a copy of the inventory array
        const newInventory = [...prevState.inventory];
        // Remove the item at the found index
        newInventory.splice(index, 1);
        return { ...prevState, inventory: newInventory };
      }
      // If the item is not found, return the state as is
      return prevState;
    });

  }, [mapItems, mapName, loggedAccount]);

  const moveItemFromMap = useCallback((newItem, oldItem) => {
    const namemap = mapName;

    // Add the new item to the mapItems array
    let addItemToArray = [...mapItems, {
      newItem: newItem.newItem,
      positionX: newItem.positionX,
      positionY: newItem.positionY
    }];

    // Find the index of the old item in the addItemToArray array
    const itemIndex = addItemToArray.findIndex(item =>
      item.newItem === oldItem.newItem &&
      item.positionX === oldItem.positionX &&
      item.positionY === oldItem.positionY
    );

    let removedItem;

    // If the old item was found in the addItemToArray array, remove it
    if (itemIndex !== -1) {
      removedItem = addItemToArray.splice(itemIndex, 1)[0];
      socket.emit("removemapitem", { mapname: namemap, item: removedItem });
    }

    // Update the mapItems state with the addItemToArray array
    setMapItems(addItemToArray);
    socket.emit("createmapitem", { mapname: namemap, item: addItemToArray });

    console.log(removedItem);

  }, [mapItems, mapName, loggedAccount]);


  const getItemFromMap = useCallback((newItem, positionX, positionY) => {
    const namemap = mapName;

    // Find the index of the first item that matches the condition
    const itemIndex = mapItems.findIndex(item => item.newItem === newItem && item.positionX === positionX && item.positionY === positionY);

    let removedItem;
    if (itemIndex !== -1) {
      // Remove the item from the mapItems array
      removedItem = mapItems.splice(itemIndex, 1)[0];
      setMapItems([...mapItems]);
      socket.emit("removemapitem", { mapname: namemap, item: removedItem });
    }

    setLoggedAccount(prevState => {
      // Add the item to the inventory array
      const newInventory = [...prevState.inventory, newItem];
      return { ...prevState, inventory: newInventory };
    });

  }, [mapItems, mapName, loggedAccount]);

  /*  */




  return (

    <div style={{ display: 'flex', gap: '100px' }} >


      {!logged ?
        <div style={{ display: 'flex', flexDirection: "column" }}>
          Create Account

          <input value={username} onChange={(e) => {
            setUsername(e.target.value);
          }} type="text" placeholder="Enter your name" />
          <input value={password} onChange={(e) => {
            setPassword(e.target.value);
          }} type="text" placeholder="Enter your password" />
          <input value={email} onChange={(e) => {
            setEmail(e.target.value);
          }} type="text" placeholder="Enter your email" />
          <button onClick={submitCreateAcc} type="button">Submit</button>
          <h1></h1>
        </div>
        : null}

      {!logged ? <div style={{ display: 'flex', flexDirection: "column" }}>
        Login
        <input value={username} onChange={(e) => {
          setUsername(e.target.value);
        }} type="text" placeholder="Enter your name" />
        <input value={password} onChange={(e) => {
          setPassword(e.target.value);
        }} type="text" placeholder="Enter your password" />
        <input value={email} onChange={(e) => {
          setEmail(e.target.value);
        }} type="text" placeholder="Enter your email" />
        <button onClick={submitLogin} type="button">Submit</button>
        <h1></h1>
      </div> :
        <button onClick={() => {
          socket.emit("disconnectuser");
          setLogged(false);
        }} >
          Deslogar
        </button>

      }

      <div style={{ display: logged ? 'flex' : 'none' }}>
        Mude as posições X e Y!


        <br />
        Qualquer outro player logado poderá ver você mudando em tempo real

        <br />
        Seu nome é: <span style={{ fontSize: '24px', fontWeight: 'bold' }} > {loggedAccount?.username} </span>
        <h1>{logged ?
          <div>
            Mova com o teclado nas teclas:



            <br />
            W A S D


          </div> : 'Você não está logado'}</h1>

      </div>





      <div style={{ display: logged ? 'unset' : 'none' }} >
        <input value={newMapName} onChange={(e) => { setNewMapName(e.target.value) }} type="text"
          placeholder="Enter the map name" />
        <button disabled={!loggedAccount.dev} type='button' onClick={() => {
          saveMap();
        }} >Salvar mapa novo </button>
        <div>
          Seu HP ATUAL: {loggedAccount.health}/{loggedAccount.maxHealth}
        </div>
        <button type='button' onClick={() => {
          RunSimpleFullHeal(loggedAccount);


        }} >Curar personagem </button>
        {loggedAccount.dev ?
          <div style={{ marginTop: '20px', color: 'black' }} >

            <div>
              <input value={newWallName}

                type="text" placeholder="Enter the wall name" />
              <select value={wallrotate}
                onChange={(e) => {
                  setWallRotate(e.target.value)
                }}>
                <option value="0">0</option>
                <option value="90">90</option>
                <option value="180">180</option>
                <option value="270">270</option>
              </select>
            </div>
            <button onClick={() => {
              setPlaceFloor(false)
              setPlaceDecor(false)
              setPlaceWalls(!placeWalls)
            }} >
              {placeWalls ? 'Stop placing/removing wall' : 'Place/remove Wall'}
            </button>

            <div style={{ display: 'flex' }}>
              {
                newWallName ?
                  <img
                    style={{
                      transform: `rotate(${wallrotate}deg) ${wallrotate === 180 || wallrotate === 270 ? 'scaleX(-1)' : ''}`
                    }}
                    src={require(`./components/TILES_WALLS/${newWallName}.png`)}
                    width={64} height={64}
                    alt='npc'
                  /> : null
              }
              Walls :
              {
                images.map((image, index) => (
                  <img
                    key={index}
                    style={{
                      transform: `rotate(${wallrotate}deg) ${wallrotate === 180 || wallrotate === 270 ? 'scaleX(-1)' : ''}`
                    }}
                    src={image.src}
                    width={64} height={64}
                    alt='npc'
                    onClick={() => setNewWallName(image.name)}
                  />
                ))
              }
            </div>


          </div> : null}
        {loggedAccount.dev ?
          <div style={{ marginTop: '20px', color: 'black', position: 'absolute', top: '110px', left: '500px' }} >

            <div>
              <input value={newDecorName}
                onChange={(e) => { setNewDecorName(e.target.value) }}
                type="text" placeholder="Enter the decoration name" />
            </div>
            <button onClick={() => {
              setPlaceDecor(!placeDecor)
              setPlaceWalls(false)
              setPlaceFloor(false)
            }} >
              {placeDecor ? 'Stop placing/removing decoration' : 'Place/remove decoration'}
            </button>

            <div style={{ display: 'flex' }}>
              Decoration :
            </div>


          </div> : null}

      </div>
      <div style={{
        display: logged ? 'flex' : 'none', flexDirection: 'column',
        position: 'absolute', width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        top: '160px',
        left: '-100px'

      }} >
        <h1 style={{ position: 'relative', bottom: '10px' }} >
          Map Loader ({mapName})
        </h1>

        {loggedAccount.dev ?
          <div style={{ position: 'absolute', top: '-30px', left: '300px', color: 'black' }} >

            <div>
              <input value={newFloorName}
                onChange={(e) => { setNewFloorName(e.target.value) }}
                type="text" placeholder="Enter the floor name" />
            </div>
            <button onClick={() => {
              setPlaceFloor(!placeFloor)
              setPlaceDecor(false)
              setPlaceWalls(false)
            }} >
              {placeFloor ? 'Stop placing/removing floor' : 'Place/remove floor'}
            </button>
            <button onClick={() => {
              setFloorDecal(!floordecal)
              
            }} >
              {floordecal ? 'Click to make normal floor' : 'Click to make a decal floor'}
            </button>

            <div style={{ display: 'flex' }}>
              Floors :
            </div>

          </div> : null}
        <div className={styles.mapBody} >
          <div onMouseDown={(event) => {
            if (event.shiftKey && event.button === 0) { // Check if shift key is held and left button was clicked
              const rect = mapFullRef.current.getBoundingClientRect();
              const x = Math.floor((event.clientX - rect.left) / 32);
              const y = Math.floor((event.clientY - rect.top) / 32);
              setSelectionStart([x, y]);
              setIsSelecting(true);
              console.log('start: ', [x, y])
            }
          }}
            onMouseUp={(event) => {
              if (isSelecting) {
                const rect = mapFullRef.current.getBoundingClientRect();
                const x = Math.floor((event.clientX - rect.left) / 32);
                const y = Math.floor((event.clientY - rect.top) / 32);
                // Now you have the start and end points of the selection
                // You can use them to place floors
                console.log('end: ', [x, y])
                if (placeFloor) {
                  const newFloors = [];
                  for (let i = Math.min(selectionStart[0], x); i <= Math.max(selectionStart[0], x); i++) {
                    for (let j = Math.min(selectionStart[1], y); j <= Math.max(selectionStart[1], y); j++) {
                      newFloors.push({ Name: newFloorName, X: i, Y: j });
                    }
                  }
                  console.log('newFloors: ', newFloors)
                  setMapFloors(prev => [...prev, ...newFloors]);
                }
                setIsSelecting(false);
              }
            }}
            onMouseMove={(event) => {
              if (isSelecting) {
                // You can update the selection area here if you want to show it visually
              }
            }} onContextMenu={(event) => {
              event.preventDefault(); // Prevent the context menu from showing
              if (placeFloor) {

                const rect = mapFullRef.current.getBoundingClientRect();
                const x = Math.floor((event.clientX - rect.left) / 32);
                const y = Math.floor((event.clientY - rect.top) / 32);
                if(floordecal){
                  setMapFloorDecals(prev => prev.filter(floor => floor.X !== x || floor.Y !== y));
                }else{

                  setMapFloors(prev => prev.filter(floor => floor.X !== x || floor.Y !== y));
                }
              }
              if (placeWalls) {

                const rect = mapFullRef.current.getBoundingClientRect();
                const x = Math.floor((event.clientX - rect.left) / 32);
                const y = Math.floor((event.clientY - rect.top) / 32);

                setMapWalls(prev => prev.filter(floor => floor.X !== x || floor.Y !== y));
              }
              setTarget({ Type: 'player', Name: 'target', Action: 'follow' });

            }} ref={mapFullRef}
            onClick={(event) => {


              if (event.button === 0) { // Check if left button was clicked
                const rect = mapFullRef.current.getBoundingClientRect();
                const x = Math.floor((event.clientX - rect.left) / 32);
                const y = Math.floor((event.clientY - rect.top) / 32);

                if (placeFloor) {
                  if(floordecal){

                    setMapFloorDecals(prev => [...prev, { Name: newFloorName, X: x, Y: y }])
                      console.log(mapFloorDecals)
                  }else{

                    setMapFloors(prev => [...prev, { Name: newFloorName, X: x, Y: y }])
                  }
                }
                if (placeWalls) {
                  setMapWalls(prev => {
                    // Find the index of the wall at the current location
                    const index = prev.findIndex(wall => wall.X === x && wall.Y === y);

                    // If a wall exists at the current location, replace it
                    if (index !== -1) {
                      const newWalls = [...prev];
                      newWalls[index] = { Name: newWallName, X: x, Y: y, ROTATION: wallrotate };
                      return newWalls;
                    }

                    // If no wall exists at the current location, add a new one
                    return [...prev, { Name: newWallName, X: x, Y: y, ROTATION: wallrotate }];
                  });
                }
                if (placeDecor) {
                  setMapFloors(prev => [...prev, { Name: newDecorName, X: x, Y: y }])
                }
              }

            }}

            onDrop={(e) => {
              e.preventDefault();
              const rect = mapFullRef.current.getBoundingClientRect();
              const x = Math.floor((e.clientX - rect.left) / 32);
              const y = Math.floor((e.clientY - rect.top) / 32);
              let itemId = e.dataTransfer.getData("text");


              // Check if itemId is a JSON string and contains the newItem property
              try {
                const parsedItemId = JSON.parse(itemId);
                console.log(parsedItemId)

                let newItem = { ...parsedItemId };
                newItem.positionX = x;
                newItem.positionY = y;
                console.log(newItem)

                moveItemFromMap(newItem, parsedItemId);
                console.log('AQUI NO TRY')


              } catch (error) {
                // itemId is not a JSON string, do nothing
                if (itemId) {

                  addItemToMap(itemId, x, y);

                  console.log('inventory to map item drop')
                }
              }

            }}
            onDragOver={(e) => e.preventDefault()}

            className={styles.mapFull}>

            <div style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              top: `${(menuLocation[1] * 32)}px`,
              left: `${(menuLocation[0] * 32)}px`,
              boxSizing: 'border-box', border: '1px solid black', zIndex: '9999',
              backgroundColor: 'grey'

            }}>

              {menuLocation[3] === 'player' ?
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '10px'
                }} >
                  <div  >
                    Alvo: Player {menuLocation[2]}
                  </div>
                  <div onClick={() => {
                    setTarget({ Type: 'player', Name: menuLocation[2], Action: 'attack' });
                  }} style={{ border: '2px solid red', cursor: 'pointer' }}>
                    Atacar
                  </div>
                  <div onClick={() => {
                    setTarget({ Type: 'player', Name: menuLocation[2], Action: 'follow' });
                  }} style={{ border: '2px solid green', cursor: 'pointer' }}>
                    Seguir
                  </div>
                  <div style={{ border: '2px solid yellow', cursor: 'pointer' }}>
                    Ver informações
                  </div>
                </div>
                : null}
              {menuLocation[3] === 'monster' ?
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '10px'
                }} >
                  <div  >
                    Alvo: Monstro {menuLocation[2]}
                  </div>
                  <div onClick={() => {
                    setTarget({ Type: 'monster', Name: menuLocation[2], Action: 'attack' });
                  }} style={{ border: '2px solid red', cursor: 'pointer' }}>
                    Atacar
                  </div>
                  <div onClick={() => {
                    setTarget({ Type: 'monster', Name: menuLocation[2], Action: 'follow' });
                  }} style={{ border: '2px solid green', cursor: 'pointer' }}>
                    Seguir
                  </div>
                  <div style={{ border: '2px solid yellow', cursor: 'pointer' }}>
                    Ver informações
                  </div>
                </div>
                : null}


            </div>
            <div >
              {mapFloors.map((floors, index) => (
                <div
                  onClick={() => {
                    setMenuLocation([-30, -30]);
                  }}
                  style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    top: `${(floors?.Y * 32)}px`,
                    left: `${(floors?.X * 32)}px`,
                    boxSizing: 'border-box',
                    backgroundImage: `url(${require(`./components/TILES_FLOORS/${floors?.Name}.png`)})`,
                  }}
                  key={index} >
                </div>
              ))}
            </div>
            <div >
              {mapOthers.map((floors, index) => (
                <div
                  onClick={() => {
                    setMenuLocation([-30, -30]);
                  }}
                  style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    top: `${(floors?.Y * 32)}px`,
                    left: `${(floors?.X * 32)}px`,
                    boxSizing: 'border-box',
                    backgroundImage: `url(${require(`./components/TILES_FLOORS/${floors?.Name}.png`)})`,
                  }}
                  key={index} >
                </div>
              ))}
            </div>
            <div >
              {mapWalls.map((floors, index) => (
                <div
                  draggable={false}

                  onClick={() => {
                    setMenuLocation([-30, -30]);
                  }}
                  style={{
                    position: 'absolute',
                    width: '64px',
                    height: '64px',
                    top: `${((floors?.Y - 1) * 32)}px`,
                    left: `${((floors?.X - 1) * 32)}px`,
                    boxSizing: 'border-box',
                    zIndex: `${floors?.Y + floors?.X}`,
                    transform: `rotate(${floors?.ROTATION}deg) ${floors?.ROTATION === 180 ? 'scaleX(-1)' : ''} 
                    ${floors?.ROTATION === 270 ? 'scaleY(-1)' : ''}`,
                    backgroundImage: `url(${require(`./components/TILES_WALLS/${floors?.Name}.png`)})`,
                  }}
                  key={index} >
                </div>
              ))}
            </div>
            <div >
              {mapFloorDecals.map((floors, index) => (
                <div
                  onClick={() => {
                    setMenuLocation([-30, -30]);
                  }}
                  style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    top: `${(floors?.Y * 32)}px`,
                    left: `${(floors?.X * 32)}px`,
                    boxSizing: 'border-box',
                    backgroundImage: `url(${require(`./components/TILES_FLOORS/${floors?.Name}.png`)})`,
                  }}
                  key={index} >
                </div>
              ))}
            </div>
            <div >
              {mapItems.map((floors, index) => (
                <div
                  draggable="true"
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", JSON.stringify(floors));
                    const distanceX = floors.positionX - loggedAccount.position[0];
                    const distanceY = floors.positionY - loggedAccount.position[1];

                    event.dataTransfer.setData("distanceX", distanceX);
                    event.dataTransfer.setData("distanceY", distanceY);
                    console.log(floors)
                    event.dataTransfer.setData("source", "ground");

                  }}

                  style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    top: `${(floors?.positionY * 32)}px`,
                    left: `${(floors?.positionX * 32)}px`,
                    boxSizing: 'border-box',



                  }}
                  key={index} >

                  <img
                    style={{ position: 'relative', bottom: '0px' }}
                    src={require(`./components/TILES_ITEMS/${floors.newItem}.gif`)}
                    alt={floors.newItem}
                    width={32}
                    height={32}
                  />
                </div>
              ))}
            </div>
            <div >
              {playersLoggedInfo.filter(player => player.username !== loggedAccount.username).map((player, index) => (
                <div
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (playing) {
                      const rect = mapFullRef.current.getBoundingClientRect();
                      const x = Math.floor((e.clientX - rect.left) / 32);
                      const y = Math.floor((e.clientY - rect.top) / 32);
                      setMenuLocation([x, y, player.username, 'player']);

                    }
                  }}
                  style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    maxWidth: '32px',

                    top: `${(player?.position[1] * 32)}px`,
                    left: `${(player?.position[0] * 32)}px`,
                    boxSizing: 'border-box',
                    transition: `all ${1 / player.atributes.movespeed}s ease-in-out`,
                    border: target.Type === 'player' && target.Name === player.username
                      ? (target.Action === 'follow' ? '2px solid green' :
                        (target.Action === 'attack' ? '2px solid red' : 'none'))
                      : '2px solid transparent',

                  }}
                  key={index} >
                  <div style={{
                    position: 'relative',
                    bottom: '65px',
                    justifyContent: 'center',
                    display: 'flex'
                  }} >
                    {player?.username}

                  </div>
                  <div style={{
                    position: 'relative',
                    bottom: '65px',
                    justifyContent: 'center',
                    display: 'flex',
                    width: '100%',

                    textWrap: 'nowrap'

                  }} >
                    Lvl {player.level}
                  </div>
                  <div style={{ position: 'relative', top: '-75px', left: '-35px', minHeight: '135px' }} >

                    <Character direction={playerPosition?.find(user => user.username === player?.username)?.direction} isMoving={playerPosition.find(user => user.username === player?.username)?.moving} />
                  </div>
                  <div style={{
                    position: 'relative',
                    bottom: '130px',
                    justifyContent: 'center',
                    display: 'flex',


                  }} >
                    <div style={{
                      backgroundColor: 'white',
                      minWidth: '32px', width: '32px',
                      height: '4px', display: 'flex',
                      justifyContent: 'center',
                      alignContent: 'center', overflow: 'hidden',
                      alignItems: 'center', border: '2px solid white'
                    }} >
                      <div style={{
                        backgroundColor: 'red',
                        width: '100%', maxWidth: '32px',
                        position: 'relative',
                        right: `${32 - (32 * player.health / player.maxHealth)}px`,
                        height: '4px'
                      }}>

                      </div>
                    </div>


                  </div>
                </div>
              ))}
            </div>
            <div >
              {Npcs?.map((npc, index) => (
                <div

                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (playing) {
                      const rect = mapFullRef.current.getBoundingClientRect();
                      const x = Math.floor((e.clientX - rect.left) / 32);
                      const y = Math.floor((e.clientY - rect.top) / 32);
                      setMenuLocation([x, y, npc.Name, 'monster']);

                    }
                  }}
                  style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px',
                    top: `${(npc.Y * 32)}px`,
                    left: `${(npc.X * 32)}px`,
                    boxSizing: 'border-box',
                    transition: `all ${1 / npc.speed}s ease-in-out`,

                    display: npc.health === 0 ? 'none' : 'block'

                  }}
                  key={index} >
                  <div style={{
                    position: 'relative',
                    bottom: '25px',
                    justifyContent: 'center',
                    display: 'flex'
                  }} >
                    <span style={{ color: 'orange', position: 'relative', left: `${5 + (15 * npc.spriteSize)}px`, bottom: `${(15 * npc.spriteSize)}px` }} >

                      {npc.Name}
                    </span>
                    <img style={{ transform: `rotate(${npc.rotation}deg) ${npc.rotation === 180 || npc.rotation === 270 ? 'scaleX(-1)' : ''}`, position: 'relative', top: `${30 - (20 * npc.spriteSize)}px`, right: `${15 + (5 * npc.spriteSize)}px` }} src={require(`./components/TILES_NPCS/${npc.id}.gif`)} width={32 * npc.spriteSize} height={32 * npc.spriteSize} alt='npc' />
                  </div>
                  <div style={{
                    position: 'relative',
                    top: `${20 - (20 * npc.spriteSize)}px`,
                    justifyContent: 'center',
                    display: 'flex',


                  }} >
                    <div style={{
                      backgroundColor: 'white',
                      minWidth: '32px', width: '32px',
                      height: '4px', display: 'flex',
                      justifyContent: 'center',
                      alignContent: 'center', overflow: 'hidden',
                      alignItems: 'center', border: '2px solid white'
                    }} >
                      <div style={{
                        backgroundColor: 'red',
                        width: '100%', maxWidth: '32px',
                        position: 'relative',
                        right: `${32 - (32 * npc.health / npc.maxHealth)}px`,
                        height: '4px'
                      }}>

                      </div>
                      <div style={{

                        width: '100%', maxWidth: '32px',
                        position: 'absolute',

                        top: '10px',

                        height: '4px'
                      }}>
                        {/*  {npc.health}/{npc.maxHealth} */}
                      </div>

                    </div>


                  </div>

                </div>
              ))}
            </div>

            <div style={{
              position: 'absolute',
              width: '32px',
              height: '32px',
              top: `${(loggedAccount?.position[1] * 32)}px`,
              left: `${(loggedAccount?.position[0] * 32)}px`,
              boxSizing: 'border-box',
              transition: `all ${1 / loggedAccount.atributes.movespeed}s ease-in-out`,
              border: '2px solid transparent',
              zIndex: `${loggedAccount?.position[1] + loggedAccount?.position[0]}`,
            }} >
              <div style={{
                position: 'relative',
                bottom: '75px',
                justifyContent: 'center',
                display: 'flex',
                height: '0px',
                flexDirection: 'column',
              }} >
                {showMessage &&
                  <div style={{
                    color: 'white',
                    display: 'flex',
                    textWrap: 'nowrap',
                    transition: 'opacity 1s ease-out',
                    opacity: showMessage ? 1 : 0
                  }}>
                    Você deu

                    <span style={{ color: 'red' }}>

                      {lastDamage}
                    </span>


                    de dano!
                  </div>
                }
                {showMessageDmgReceived &&
                  <div style={{
                    color: 'white',
                    display: 'flex',
                    textWrap: 'nowrap',
                    transition: 'opacity 1s ease-out',
                    opacity: showMessage ? 1 : 0
                  }}>
                    Você recebeu
                    <span style={{ color: 'red' }}>

                      {lastDamageReceived}
                    </span>

                    de dano!
                  </div>
                }

              </div>
              <div style={{
                position: 'relative',
                bottom: '75px',
                justifyContent: 'center',
                display: 'flex'
              }} >
                {loggedAccount?.username}
              </div>
              
              <div style={{
                position: 'relative', top: '-75px', left: '-35px', minHeight: '135px',
                width: '0px'
              }} >

                <Character direction={direction} isMoving={isMoving} />
              </div>

              <div style={{
                position: 'relative',
                bottom: '210px',
                justifyContent: 'center',
                display: 'flex',
                zIndex: `${(loggedAccount?.position[1]+1) + (loggedAccount?.position[0]+1)}`,

              }} >
                <div style={{
                  backgroundColor: 'white',
                  minWidth: '32px', width: '32px',
                  height: '4px', display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center', overflow: 'hidden',
                  alignItems: 'center', border: '2px solid white'
                }} >
                  <div style={{
                    backgroundColor: 'red',
                    width: '100%', maxWidth: '32px',
                    position: 'relative',
                    right: `${32 - (32 * loggedAccount.health / loggedAccount.maxHealth)}px`,
                    height: '4px'
                  }}>

                  </div>
                </div>


              </div>

            </div>

          </div>
        </div>
      </div>
      <div style={{
        gap: '40px', display: logged ? 'flex' : 'none', alignItems: 'center',
        flexDirection: 'column', width: '300px', height: '430px', position: 'absolute',
        border: '2px solid black', right: '10px', top: '10px'
      }} >

        <div>Equipamento  Dmg calculator:(damage * (1 - (dmg reduction)))</div>
        <div style={{ display: 'flex', gap: '10px' }}  >
          <div>
            Atk
            <span style={{ fontWeight: 'bold', color: 'red', marginLeft: '2px' }} >

              {(loggedAccount?.atributes?.strength + equipStats.strength) +
                (loggedAccount?.atributes?.dexterity + equipStats.dexterity) * 2 +
                (loggedAccount?.atributes?.intelligence + equipStats.intelligence) * 2
              }
            </span>

          </div>
          <div>
            Def
            <span style={{ fontWeight: 'bold', color: 'red', marginLeft: '2px' }} >

              {(loggedAccount?.atributes?.strength + equipStats.strength) * 2 +
                (loggedAccount?.atributes?.dexterity + equipStats.dexterity) +
                (loggedAccount?.atributes?.constitution + equipStats.constitution) * 2
              }
              (Dmg Reduction:
              {
                (
                  (loggedAccount?.atributes?.strength + equipStats.strength) * 2 +
                  (loggedAccount?.atributes?.dexterity + equipStats.dexterity) +
                  (loggedAccount?.atributes?.constitution + equipStats.constitution) * 2
                ) / 100
              }

              )
            </span>

          </div>

        </div>

        <div style={{ display: 'flex' }} >
          <div onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (e.dataTransfer.getData("source") !== 'inventory') {
                return;
              }
              const item = JSON.parse(e.dataTransfer.getData("item"));
              if (item.object.type === 'helmet') {
                setLoggedAccount(prevState => {

                  const index = prevState.inventory.findIndex(i => i === item.object.id);

                  if (index !== -1) {
                    prevState.inventory.splice(index, 1);
                  }
                  const newEquip = { ...prevState.equipped, head: item.object };
                  return { ...prevState, equipped: newEquip };
                });
              }
            }} style={{
              width: '32px', height: '32px', border: '1px solid black',
              display: 'flex',
              marginInline: '30px', backgroundColor: 'black'
            }} ><span style={{ position: 'relative', top: '-20px' }} >Cabeça</span>
            {loggedAccount?.equipped?.head?.id ?
              <img
                draggable="false"
                onClick={(e) => {
                  e.preventDefault();

                  setLoggedAccount(prevState => {
                    const newInventory = [...prevState.inventory, loggedAccount?.equipped?.head?.id];
                    const newEquip = { ...prevState.equipped, head: null };
                    return { ...prevState, inventory: newInventory, equipped: newEquip };
                  });

                }}

                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (e.dataTransfer.getData("source") !== 'inventory') {
                    return;
                  }
                  const item = JSON.parse(e.dataTransfer.getData("item"));
                  if (item.object.type === 'head') {

                    setLoggedAccount(prevState => {
                      const newInventory = [...prevState.inventory];
                      const index = newInventory.findIndex(i => i === item.object.id);

                      if (index !== -1) {

                        newInventory.push(loggedAccount?.equipped?.head?.id);
                      }
                      console.log(newInventory)
                      const newEquip = { ...prevState.equipped, head: item.object };
                      return { ...prevState, inventory: newInventory, equipped: newEquip };
                    });
                  }
                }}

                style={{ position: 'relative', top: '0px', textWrap: 'nowrap', left: '-46px' }}
                src={require(`./components/TILES_ITEMS/${loggedAccount?.equipped?.head?.id}.gif`)}
                alt={loggedAccount?.equipped?.head?.name} width={32} height={32} />
              : null}</div>
          <div onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (e.dataTransfer.getData("source") !== 'inventory') {
                return;
              }
              const item = JSON.parse(e.dataTransfer.getData("item"));
              if (item.object.type === 'necklace') {
                setLoggedAccount(prevState => {

                  const index = prevState.inventory.findIndex(i => i === item.object.id);

                  if (index !== -1) {
                    prevState.inventory.splice(index, 1);
                  }
                  const newEquip = { ...prevState.equipped, necklace: item.object };
                  return { ...prevState, equipped: newEquip };
                });
              }
            }} style={{
              width: '32px', height: '32px', border: '1px solid black',
              display: 'flex',
              marginInline: '30px', backgroundColor: 'black'
            }}><span style={{ position: 'relative', top: '-20px' }} >Colar</span>
            {loggedAccount?.equipped?.necklace?.id ?
              <img
                draggable="false"
                onClick={(e) => {
                  e.preventDefault();
                  setLoggedAccount(prevState => {
                    const newInventory = [...prevState.inventory, loggedAccount?.equipped?.necklace?.id];
                    const newEquip = { ...prevState.equipped, necklace: null };
                    return { ...prevState, inventory: newInventory, equipped: newEquip };
                  });

                }}

                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (e.dataTransfer.getData("source") !== 'inventory') {
                    return;
                  }
                  const item = JSON.parse(e.dataTransfer.getData("item"));
                  if (item.object.type === 'necklace') {

                    setLoggedAccount(prevState => {
                      const newInventory = [...prevState.inventory];
                      const index = newInventory.findIndex(i => i === item.object.id);

                      if (index !== -1) {

                        newInventory.push(loggedAccount?.equipped?.necklace?.id);
                      }
                      console.log(newInventory)
                      const newEquip = { ...prevState.equipped, necklace: item.object };
                      return { ...prevState, inventory: newInventory, equipped: newEquip };
                    });
                  }
                }}

                style={{ position: 'relative', top: '0px', textWrap: 'nowrap', left: '-40px' }}
                src={require(`./components/TILES_ITEMS/${loggedAccount?.equipped?.necklace?.id}.gif`)}
                alt={loggedAccount?.equipped?.necklace?.name} width={32} height={32} />
              : null}</div>
        </div>
        <div style={{ display: 'flex' }}>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (e.dataTransfer.getData("source") !== 'inventory') {
                return;
              }
              const item = JSON.parse(e.dataTransfer.getData("item"));
              if (item.object.type === 'sword') {
                setLoggedAccount(prevState => {

                  const index = prevState.inventory.findIndex(i => i === item.object.id);

                  if (index !== -1) {
                    prevState.inventory.splice(index, 1);
                  }
                  const newEquip = { ...prevState.equipped, leftHand: item.object };
                  return { ...prevState, equipped: newEquip };
                });
              }
            }}
            style={{
              width: '32px', height: '32px', border: '1px solid black',
              display: 'flex',
              marginInline: '30px', backgroundColor: 'black'
            }}>
            <span style={{ position: 'relative', top: '-20px', textWrap: 'nowrap', left: '-20px' }} >
              Mão esquerda</span>
            {loggedAccount?.equipped?.leftHand?.id ?
              <img
                draggable="false"
                onClick={(e) => {
                  e.preventDefault();
                  setLoggedAccount(prevState => {
                    const newInventory = [...prevState.inventory, loggedAccount?.equipped?.leftHand?.id];
                    const newEquip = { ...prevState.equipped, leftHand: null };
                    return { ...prevState, inventory: newInventory, equipped: newEquip };
                  });

                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (e.dataTransfer.getData("source") !== 'inventory') {
                    return;
                  }
                  const item = JSON.parse(e.dataTransfer.getData("item"));
                  if (item.object.type === 'sword') {
                    setLoggedAccount(prevState => {

                      const index = prevState.inventory.findIndex(i => i === item.object.id);

                      if (index !== -1) {

                        prevState.inventory.push(loggedAccount?.equipped?.leftHand?.id);
                      }
                      const newEquip = { ...prevState.equipped, leftHand: item.object };
                      return { ...prevState, equipped: newEquip };
                    });
                  }
                }}
                style={{ position: 'relative', top: '0px', textWrap: 'nowrap', left: '-90px' }}
                src={require(`./components/TILES_ITEMS/${loggedAccount?.equipped?.leftHand?.id}.gif`)}
                alt={loggedAccount?.equipped?.leftHand?.name} width={32} height={32} />
              : null}


          </div>
          <div onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {

              if (e.dataTransfer.getData("source") !== 'inventory') {
                return;
              }
              const item = JSON.parse(e.dataTransfer.getData("item"));
              if (item.object.type === 'armor') {
                setLoggedAccount(prevState => {

                  const index = prevState.inventory.findIndex(i => i === item.object.id);

                  if (index !== -1) {
                    prevState.inventory.splice(index, 1);
                  }
                  const newEquip = { ...prevState.equipped, chest: item.object };
                  return { ...prevState, equipped: newEquip };
                });
              }
            }} style={{
              width: '32px', height: '32px', border: '1px solid black',
              display: 'flex',
              marginInline: '30px', backgroundColor: 'black'
            }}><span style={{ position: 'relative', top: '-20px' }} >
              Tronco</span>{loggedAccount?.equipped?.chest?.id ?
                <img
                  draggable="false"
                  onClick={(e) => {
                    e.preventDefault();

                    setLoggedAccount(prevState => {
                      const newInventory = [...prevState.inventory, loggedAccount?.equipped?.chest?.id];
                      const newEquip = { ...prevState.equipped, chest: null };
                      return { ...prevState, inventory: newInventory, equipped: newEquip };
                    });

                  }}

                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    if (e.dataTransfer.getData("source") !== 'inventory') {
                      return;
                    }
                    const item = JSON.parse(e.dataTransfer.getData("item"));
                    if (item.object.type === 'armor' && e.dataTransfer.getData("source") !== 'inventory') {
                      setLoggedAccount(prevState => {

                        const index = prevState.inventory.findIndex(i => i === item.object.id);

                        if (index !== -1) {

                          prevState.inventory.push(loggedAccount?.equipped?.chest?.id);
                        }
                        const newEquip = { ...prevState.equipped, chest: item.object };
                        return { ...prevState, equipped: newEquip };
                      });
                    }
                  }}

                  style={{ position: 'relative', top: '0px', textWrap: 'nowrap', left: '-46px' }}
                  src={require(`./components/TILES_ITEMS/${loggedAccount?.equipped?.chest?.id}.gif`)}
                  alt={loggedAccount?.equipped?.chest?.name} width={32} height={32} />
                : null}
          </div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (e.dataTransfer.getData("source") !== 'inventory') {
                return;
              }
              const item = JSON.parse(e.dataTransfer.getData("item"));
              if (item.object.type === 'sword') {
                setLoggedAccount(prevState => {

                  const index = prevState.inventory.findIndex(i => i === item.object.id);

                  if (index !== -1) {
                    prevState.inventory.splice(index, 1);
                  }
                  const newEquip = { ...prevState.equipped, rightHand: item.object };
                  return { ...prevState, equipped: newEquip };
                });
              }
            }}
            style={{
              width: '32px', height: '32px', border: '1px solid black',
              display: 'flex',
              marginInline: '30px', backgroundColor: 'black'
            }}>
            <span style={{ position: 'relative', top: '-20px', textWrap: 'nowrap', left: '-20px' }} >
              Mão direita</span>
            {loggedAccount?.equipped?.rightHand?.id ?
              <img
                draggable="false"
                onClick={(e) => {
                  e.preventDefault();
                  setLoggedAccount(prevState => {
                    const newInventory = [...prevState.inventory, loggedAccount?.equipped?.rightHand?.id];
                    const newEquip = { ...prevState.equipped, rightHand: null };
                    return { ...prevState, inventory: newInventory, equipped: newEquip };
                  });

                }}

                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (e.dataTransfer.getData("source") !== 'inventory') {
                    return;
                  }
                  const item = JSON.parse(e.dataTransfer.getData("item"));
                  if (item.object.type === 'sword') {
                    setLoggedAccount(prevState => {

                      const index = prevState.inventory.findIndex(i => i === item.object.id);

                      if (index !== -1) {

                        prevState.inventory.push(loggedAccount?.equipped?.rightHand?.id);
                      }
                      const newEquip = { ...prevState.equipped, rightHand: item.object };
                      return { ...prevState, equipped: newEquip };
                    });
                  }
                }}

                style={{ position: 'relative', top: '0px', textWrap: 'nowrap', left: '-74px' }}
                src={require(`./components/TILES_ITEMS/${loggedAccount?.equipped?.rightHand?.id}.gif`)}
                alt={loggedAccount?.equipped?.rightHand?.name} width={32} height={32} />
              : null}



          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (e.dataTransfer.getData("source") !== 'inventory') {
                return;
              }
              const item = JSON.parse(e.dataTransfer.getData("item"));
              if (item.object.type === 'ring') {
                setLoggedAccount(prevState => {

                  const index = prevState.inventory.findIndex(i => i === item.object.id);

                  if (index !== -1) {
                    prevState.inventory.splice(index, 1);
                  }
                  const newEquip = { ...prevState.equipped, ring: item.object };
                  return { ...prevState, equipped: newEquip };
                });
              }
            }} style={{
              width: '32px', height: '32px', border: '1px solid black',
              display: 'flex',
              marginInline: '30px', backgroundColor: 'black'
            }}><span style={{ position: 'relative', top: '-20px' }} >Anel</span>
            {loggedAccount?.equipped?.ring?.id ?
              <img
                draggable="false"
                onClick={(e) => {
                  e.preventDefault();
                  setLoggedAccount(prevState => {
                    const newInventory = [...prevState.inventory, loggedAccount?.equipped?.ring?.id];
                    const newEquip = { ...prevState.equipped, ring: null };
                    return { ...prevState, inventory: newInventory, equipped: newEquip };
                  });

                }}

                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (e.dataTransfer.getData("source") !== 'inventory') {
                    return;
                  }
                  const item = JSON.parse(e.dataTransfer.getData("item"));
                  if (item.object.type === 'ring') {
                    setLoggedAccount(prevState => {

                      const index = prevState.inventory.findIndex(i => i === item.object.id);

                      if (index !== -1) {

                        prevState.inventory.push(loggedAccount?.equipped?.ring?.id);
                      }
                      const newEquip = { ...prevState.equipped, ring: item.object };
                      return { ...prevState, equipped: newEquip };
                    });
                  }
                }}

                style={{ position: 'relative', top: '0px', textWrap: 'nowrap', left: '-34px' }}
                src={require(`./components/TILES_ITEMS/${loggedAccount?.equipped?.ring?.id}.gif`)}
                alt={loggedAccount?.equipped?.ring?.name} width={32} height={32} />
              : null}</div>
          <div onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (e.dataTransfer.getData("source") !== 'inventory') {
                return;
              }
              const item = JSON.parse(e.dataTransfer.getData("item"));
              if (item.object.type === 'legs') {
                setLoggedAccount(prevState => {

                  const index = prevState.inventory.findIndex(i => i === item.object.id);

                  if (index !== -1) {
                    prevState.inventory.splice(index, 1);
                  }
                  const newEquip = { ...prevState.equipped, legs: item.object };
                  return { ...prevState, equipped: newEquip };
                });
              }
            }} style={{
              width: '32px', height: '32px', border: '1px solid black',
              display: 'flex',
              marginInline: '30px', backgroundColor: 'black'
            }}><span style={{ position: 'relative', top: '-20px' }} >Perna</span>
            {loggedAccount?.equipped?.legs?.id ?
              <img
                draggable="false"
                onClick={(e) => {
                  e.preventDefault();
                  setLoggedAccount(prevState => {
                    const newInventory = [...prevState.inventory, loggedAccount?.equipped?.legs?.id];
                    const newEquip = { ...prevState.equipped, legs: null };
                    return { ...prevState, inventory: newInventory, equipped: newEquip };
                  });

                }}

                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (e.dataTransfer.getData("source") !== 'inventory') {
                    return;
                  }
                  const item = JSON.parse(e.dataTransfer.getData("item"));
                  if (item.object.type === 'legs') {

                    setLoggedAccount(prevState => {
                      const newInventory = [...prevState.inventory];
                      const index = newInventory.findIndex(i => i === item.object.id);

                      if (index !== -1) {

                        newInventory.push(loggedAccount?.equipped?.legs?.id);
                      }
                      console.log(newInventory)
                      const newEquip = { ...prevState.equipped, legs: item.object };
                      return { ...prevState, inventory: newInventory, equipped: newEquip };
                    });
                  }
                }}

                style={{ position: 'relative', top: '0px', textWrap: 'nowrap', left: '-36px' }}
                src={require(`./components/TILES_ITEMS/${loggedAccount?.equipped?.legs?.id}.gif`)}
                alt={loggedAccount?.equipped?.legs?.name} width={32} height={32} />
              : null}</div>
          <div onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (e.dataTransfer.getData("source") !== 'inventory') {
                return;
              }
              const item = JSON.parse(e.dataTransfer.getData("item"));
              if (item.object.type === 'feet') {
                setLoggedAccount(prevState => {

                  const index = prevState.inventory.findIndex(i => i === item.object.id);

                  if (index !== -1) {
                    prevState.inventory.splice(index, 1);
                  }
                  const newEquip = { ...prevState.equipped, feet: item.object };
                  return { ...prevState, equipped: newEquip };
                });
              }
            }} style={{
              width: '32px', height: '32px', border: '1px solid black',
              display: 'flex',
              marginInline: '30px', backgroundColor: 'black'
            }}><span style={{ position: 'relative', top: '-20px' }} >Botas</span>
            {loggedAccount?.equipped?.feet?.id ?
              <img
                draggable="false"
                onClick={(e) => {
                  e.preventDefault();
                  setLoggedAccount(prevState => {
                    const newInventory = [...prevState.inventory, loggedAccount?.equipped?.feet?.id];
                    const newEquip = { ...prevState.equipped, feet: null };
                    return { ...prevState, inventory: newInventory, equipped: newEquip };
                  });

                }}

                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (e.dataTransfer.getData("source") !== 'inventory') {
                    return;
                  }
                  const item = JSON.parse(e.dataTransfer.getData("item"));
                  if (item.object.type === 'feet') {
                    setLoggedAccount(prevState => {

                      const index = prevState.inventory.findIndex(i => i === item.object.id);

                      if (index !== -1) {

                        prevState.inventory.push(loggedAccount?.equipped?.feet?.id);
                      }
                      const newEquip = { ...prevState.equipped, feet: item.object };
                      return { ...prevState, equipped: newEquip };
                    });
                  }
                }}

                style={{ position: 'relative', top: '0px', textWrap: 'nowrap', left: '-36px' }}
                src={require(`./components/TILES_ITEMS/${loggedAccount?.equipped?.feet?.id}.gif`)}
                alt={loggedAccount?.equipped?.feet?.name} width={32} height={32} />
              : null}
          </div>
        </div>
        <div style={{ display: 'flex', position: 'relative', bottom: '20px', gap: '15px' }} >
          <div>
            str
            <span style={{ fontWeight: 'bold', color: 'red', marginLeft: '2px' }} >

              {loggedAccount?.atributes?.strength + equipStats.strength}
            </span>
          </div>
          <div>
            dex <span style={{ fontWeight: 'bold', color: 'red', marginLeft: '2px' }} >

              {
                loggedAccount?.atributes?.dexterity + equipStats.dexterity}
            </span>
          </div>
          <div>
            int <span style={{ fontWeight: 'bold', color: 'red', marginLeft: '2px' }} >

              {
                loggedAccount?.atributes?.intelligence + equipStats.intelligence}
            </span>
          </div>
          <div>
            char <span style={{ fontWeight: 'bold', color: 'red', marginLeft: '2px' }} >

              {
                loggedAccount?.atributes?.charisma + equipStats.charisma}
            </span>
          </div>

        </div>
        <div style={{ display: 'flex', position: 'relative', bottom: '20px', gap: '15px' }} >


          <div>
            con <span style={{ fontWeight: 'bold', color: 'red', marginLeft: '2px' }} >

              {
                loggedAccount?.atributes?.constitution + equipStats.constitution}
            </span>
          </div>
          <div>
            wis
            <span style={{ fontWeight: 'bold', color: 'red', marginLeft: '2px' }} >

              {
                loggedAccount?.atributes?.wisdom + equipStats.wisdom}
            </span>
          </div>
          <div>
            mov <span style={{ fontWeight: 'bold', color: 'red', marginLeft: '2px' }} >

              {
                loggedAccount?.atributes?.movespeed + equipStats.movespeed}
            </span>
          </div>
          <div>
            ran <span style={{ fontWeight: 'bold', color: 'red', marginLeft: '2px' }} >

              {
                loggedAccount?.atributes?.attackRange + equipStats.atkRange || 0}
            </span>
          </div>
        </div>
      </div>
      <div onDrop={(event) => {
        event.preventDefault();

        if (event.dataTransfer.getData("source") !== "inventory"
          &&
          (
            Math.abs(event.dataTransfer.getData("distanceX")) < 6
            &&
            Math.abs(event.dataTransfer.getData("distanceY")) < 6
          )
        ) {
          console.log(Math.abs(event.dataTransfer.getData("distanceX")), Math.abs(event.dataTransfer.getData("distanceY")))
          const data = JSON.parse(event.dataTransfer.getData("text/plain"));
          getItemFromMap(data.newItem, data.positionX, data.positionY);
        }
      }}
        onDragOver={(event) => {
          event.preventDefault();
        }} style={{ display: logged ? 'unset' : 'none', width: '300px', height: 'auto', position: 'absolute', border: '2px solid black', right: '10px', top: '450px' }} >
        <span style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', marginBottom: '10px' }} >
          Inventario
        </span>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(6, 1fr)',
          gap: '22px', padding: '10px'
        }} >
          {invLogged.sort((a, b) => a.object.name.localeCompare(b.object.name)).map((item, index) => (
            <div draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text", item.object.id);
                e.dataTransfer.setData("item", JSON.stringify(item));
                e.dataTransfer.setData("source", "inventory");
              }} style={{ border: '1px solid black', cursor: 'pointer', backgroundColor: 'grey', width: '50px', height: '50px' }} key={index} >
              <div style={{ fontSize: '12px', position: 'relative', bottom: '20px', textWrap: 'nowrap', marginBottom: '-10px' }} >
                {item.object.name}
              </div>
              <img src={require(`./components/TILES_ITEMS/${item.object.id}.gif`)}
                alt={item.object.name} width={32} height={32} />

              x{item.quantity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
