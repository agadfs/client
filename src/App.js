import React, { useEffect, useRef, useState } from 'react';
import styles from './App.module.css';
import io from 'socket.io-client';



const socket = io.connect("http://localhost:3001");
/* https://projectrpbackendapi.loca.lt */
/* http://localhost:3001 */

function App() {

  const mapFullRef = useRef();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState([0, 0]);

  const [mapFloors, setMapFloors] = useState([]);
  const [placeFloor, setPlaceFloor] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');
  const [newMapName, setNewMapName] = useState('');
  const [mapWalls, setMapWalls] = useState([]);
  const [mapNpcs, setMapNpcs] = useState([]);
  const [mapPlayers, setMapPlayers] = useState([]);
  const [mapPlayer, setMapPlayer] = useState({});
  const [mapName, setMapName] = useState("");
  const [logged, setLogged] = useState(false);
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
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




  /* WASD MOVEMENT */


  const [canMove, setCanMove] = useState(true); // Add this line at the beginning of your component
 
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!canMove || !['w', 'a', 's', 'd'].includes(event.key)) {
        return;
      }

      
      setLoggedAccount(prev => {
        let newPosition = [...prev.position];
        switch (event.key) {
          case 'w':
            newPosition[1] = Math.max(0, newPosition[1] - 1);

            break;
          case 'a':
            newPosition[0] = Math.max(0, newPosition[0] - 1);

            break;
          case 's':
            newPosition[1] = Math.min(9999, newPosition[1] + 1);

            break;
          case 'd':
            newPosition[0] = Math.min(9999, newPosition[0] + 1);

            break;
          default:
            break;
        }
        const floorExists = mapFloors.some(floor => floor.X === newPosition[0] && floor.Y === newPosition[1]);
        if (!floorExists) {

          return prev;
        }
       

          setCanMove(false);
        
        setTimeout(() => setCanMove(true), 1000 / prev.atributes.movespeed);
        return { ...prev, position: newPosition };
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loggedAccount, canMove, mapFloors]);

  /*  */




  const submitLogin = (e) => {
    e.preventDefault();
    socket.emit("loginacc", { username: username, password: password, email: email });
    setUsername("");
    setPassword("");
    setEmail("");
  };
  const submitCreateAcc = (e) => {
    e.preventDefault();
    socket.emit("createacc", { username: username, password: password, email: email });
    setUsername("");
    setPassword("");
    setEmail("");
  };



  /* Receive data */

  useEffect(() => {
    /* RECEIVE PLAYERS DATA */
    socket.on("receive_message", (data) => {
      if (logged) {

        setPlayersLoggedInfo(data.data)
      }

    });
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
      }
    });



  }, [socket, logged]);
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
      /* Send new data if loggedaccount changes */
      socket.emit("updateacc", { account: loggedAccount });

    }

    const sendLoggedAccount = () => {
      /* check if user is still logged */
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

  const saveMap = () => {
    const namemap = newMapName;
    const floorsmap = mapFloors;
    socket.emit("createmapfloor", { mapname: namemap, floors: floorsmap });

  };


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

      <div>
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




      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} >
        <div>

          Info dos OUTROS players logados
          <button>Andar para cima</button>
          <button>Andar para cima</button>
          <button>Andar para cima</button>
          <button>Andar para cima</button>

        </div>
        {loggedAccount.maxHealth}/{loggedAccount.health} --
        {loggedAccount.maxMana}/{loggedAccount.mana} --

        VOCÊ({loggedAccount.username}): Position X: {loggedAccount.position[0]} / Y: {loggedAccount.position[1]}
        {playersLoggedInfo.filter(info => info.username !== loggedAccount.username).map((info, index) => (
          <div key={index} >
            {info.username} : Position X:{info.position[0]} / Y:{info.position[1]}
            <br />
            {info.maxHealth}/{info.health} --
            {info.maxMana}/{info.mana}
          </div>
        ))}
      </div>
      <div>
        <input value={newMapName} onChange={(e) => { setNewMapName(e.target.value) }} type="text"
          placeholder="Enter the map name" />
        <button disabled={!loggedAccount.dev} type='button' onClick={() => {
          saveMap();
        }} >Salvar mapa novo </button>
      </div>
      <div style={{
        display: 'flex', flexDirection: 'column',
        position: 'absolute', width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        top: '160px'

      }} >
        <h1 style={{ position: 'relative', bottom: '10px' }} >
          Map Loader ({mapName})
        </h1>

        {loggedAccount.dev ?
          <div style={{ position: 'absolute', top: '-30px', left: '300px', color: 'red' }} >
            {/* floor */}
            <div>
              <input value={newFloorName}
                onChange={(e) => { setNewFloorName(e.target.value) }}
                type="text" placeholder="Enter the floor name" />
            </div>
            <button onClick={() => { setPlaceFloor(!placeFloor) }} >
              {placeFloor ? 'Stop placing/removing floor' : 'Place/remove floor'}
            </button>

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

              const rect = mapFullRef.current.getBoundingClientRect();
              const x = Math.floor((event.clientX - rect.left) / 32);
              const y = Math.floor((event.clientY - rect.top) / 32);

              if (placeFloor) {
                setMapFloors(prev => prev.filter(floor => floor.X !== x || floor.Y !== y));
              }
            }} ref={mapFullRef}
            onClick={(event) => {


              if (event.button === 0) { // Check if left button was clicked
                const rect = mapFullRef.current.getBoundingClientRect();
                const x = Math.floor((event.clientX - rect.left) / 32);
                const y = Math.floor((event.clientY - rect.top) / 32);

                if (placeFloor) {
                  setMapFloors(prev => [...prev, { Name: newFloorName, X: x, Y: y }])
                }
              }

            }} className={styles.mapFull}>

            <div >
              {mapFloors.map((floors, index) => (
                <div
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
              {playersLoggedInfo.filter(player => player.username !== loggedAccount.username).map((player, index) => (
                <div
                  style={{
                    position: 'absolute',
                    width: '32px',
                    height: '32px', border: '1px solid blue',
                    top: `${(player?.position[1] * 32)}px`,
                    left: `${(player?.position[0] * 32)}px`,
                    boxSizing: 'border-box',
                    transition: `all ${1 / player.atributes.movespeed}s ease-in-out`

                  }}
                  key={index} >
                  <div style={{
                    position: 'relative',
                    bottom: '55px',
                    justifyContent: 'center',
                    display: 'flex'
                  }} >
                    {player?.username}
                  </div>
                  <div style={{
                    position: 'relative',
                    bottom: '55px',
                    justifyContent: 'center',
                    display: 'flex',
                    width: '100%',
                    textWrap: 'nowrap'

                  }} >
                    Lvl {player.level}
                  </div>
                  <div style={{
                    position: 'relative',
                    bottom: '0px',
                    justifyContent: 'center',
                    display: 'flex',


                  }} >
                    <div style={{
                      backgroundColor: 'white',
                      minWidth: '64px', width: '64px',
                      height: '4px', display: 'flex',
                      justifyContent: 'center',
                      alignContent: 'center', overflow: 'hidden',
                      alignItems: 'center', border: '2px solid white'
                    }} >
                      <div style={{
                        backgroundColor: 'red',
                        width: '100%', maxWidth: '64px',
                        position: 'relative',
                        right: `${64 - (64 * player.health / player.maxHealth)}px`,
                        height: '4px'
                      }}>

                      </div>
                    </div>


                  </div>
                </div>
              ))}
            </div>

            <div style={{
              position: 'absolute',
              width: '32px',
              height: '32px', border: '1px solid red',
              top: `${(loggedAccount?.position[1] * 32)}px`,
              left: `${(loggedAccount?.position[0] * 32)}px`,
              boxSizing: 'border-box',
              transition: `all ${1 / loggedAccount.atributes.movespeed}s ease-in-out`

            }} >
              <div style={{
                position: 'relative',
                bottom: '65px',
                justifyContent: 'center',
                display: 'flex'
              }} >
                {loggedAccount?.username} {loggedAccount.atributes.movespeed}
              </div>
              <div style={{
                position: 'relative',
                bottom: '65px',
                justifyContent: 'center',
                display: 'flex',
                width: '100%',
                textWrap: 'nowrap'

              }} >
                Lvl {loggedAccount.level}
              </div>
             
            
             
              <div style={{
                position: 'relative',
                bottom: '130px',
                justifyContent: 'center',
                display: 'flex',


              }} >
                <div style={{
                  backgroundColor: 'white',
                  minWidth: '64px', width: '64px',
                  height: '4px', display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center', overflow: 'hidden',
                  alignItems: 'center', border: '2px solid white'
                }} >
                  <div style={{
                    backgroundColor: 'red',
                    width: '100%', maxWidth: '64px',
                    position: 'relative',
                    right: `${64 - (64 * loggedAccount.health / loggedAccount.maxHealth)}px`,
                    height: '4px'
                  }}>

                  </div>
                </div>


              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
