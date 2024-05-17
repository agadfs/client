import { useEffect, useState } from "react";



export default function CharacterMovingUp(body) {
  
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    
    if(frame < 3){
      const timer = setInterval(() => {
        setFrame((prevFrame) => (prevFrame % 3) + 1);
      }, 60);
  
      return () => clearInterval(timer);
    }
  }, [frame]);
 
 
  


  return (
    <div>
      {frame === 1 && (
      <>
      {/* cabeça */}
      <div style={{
          position: 'relative', width: '14px', height: '14px',
          backgroundColor: 'white', top: '10px', left: '42px'
        }}>

        </div>

        {/* Braço esquerdo */}
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          backgroundColor: 'red', top: '12px', left: '36px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
          backgroundColor: 'green', top: '12px', left: '36px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          backgroundColor: 'red', top: '12px', left: '36px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
          backgroundColor: 'green', top: '12px', left: '36px'
        }}>

        </div>
        {/* Braço direito */}
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          backgroundColor: 'red', top: '-12px', left: '55px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
          backgroundColor: 'green', top: '-12px', left: '55px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          backgroundColor: 'red', top: '-12px', left: '55px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
          backgroundColor: 'green', top: '-12px', left: '55px'
        }}>

        </div>
        {/* tronco */}
        <div style={{
          position: 'relative', width: '16px', height: '22px',
          backgroundColor: 'yellow', top: '-38px', left: '40px'
        }}>

        </div>
        {/* perna esquerda*/}
        <div style={{
          position: 'relative', width: '8px', height: '9px',
          backgroundColor: 'blue', top: '-38px', left: '40px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '8px', height: '3px',
          backgroundColor: 'purple', top: '-38px', left: '40px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '8px', height: '11px',
          backgroundColor: 'blue', top: '-38px', left: '40px'
        }}>

        </div>

        {/* perna direita */}
        <div style={{
          position: 'relative', width: '6px', height: '7px',
          backgroundColor: 'blue', top: '-61px', left: '51px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '6px', height: '3px',
          backgroundColor: 'purple', top: '-61px', left: '51px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '6px', height: '9px',
          backgroundColor: 'blue', top: '-61px', left: '51px'
        }}>

        </div>
      </>
      )}
      {frame === 2 && (
        <>
        {/* cabeça */}
        <div style={{
          position: 'relative', width: '14px', height: '14px',
          backgroundColor: 'white', top: '10px', left: '43px'
        }}>

        </div>

        {/* Braço esquerdo */}
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          backgroundColor: 'red', top: '12px', left: '40px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
          backgroundColor: 'green', top: '12px', left: '40px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          backgroundColor: 'red', top: '12px', left: '40px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
          backgroundColor: 'green', top: '12px', left: '40px'
        }}>

        </div>
        {/* Braço direito */}
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          backgroundColor: 'red', top: '-12px', left: '59px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
          backgroundColor: 'green', top: '-12px', left: '59px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          backgroundColor: 'red', top: '-12px', left: '59px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
          backgroundColor: 'green', top: '-12px', left: '59px'
        }}>

        </div>
        {/* tronco */}
        <div style={{
          position: 'relative', width: '16px', height: '22px',
          backgroundColor: 'yellow', top: '-38px', left: '43px'
        }}>

        </div>
        {/* perna esquerda*/}
        <div style={{
          position: 'relative', width: '6px', height: '7px',
          backgroundColor: 'blue', top: '-38px', left: '42px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '6px', height: '3px',
          backgroundColor: 'purple', top: '-38px', left: '42px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '6px', height: '9px',
          backgroundColor: 'blue', top: '-38px', left: '42px'
        }}>

        </div>

        {/* perna direita */}
        <div style={{
          position: 'relative', width: '8px', height: '9px',
          backgroundColor: 'blue', top: '-57px', left: '51px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '8px', height: '3px',
          backgroundColor: 'purple', top: '-57px', left: '51px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '8px', height: '11px',
          backgroundColor: 'blue', top: '-57px', left: '51px'
        }}>

        </div>
        </>
      )}
      {frame === 3 && (
        <>
         {/* cabeça */}
      <div style={{
        position: 'relative', width: '15px', height: '14px',
        backgroundColor: 'white', top: '10px', left: '42px'
      }}>

      </div>

      {/* Braço esquerdo */}
      <div style={{
        position: 'relative', width: '4px', height: '9px',
        backgroundColor: 'red', top: '12px', left: '36px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '4px', height: '3px',
        backgroundColor: 'green', top: '12px', left: '36px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '4px', height: '9px',
        backgroundColor: 'red', top: '12px', left: '36px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '4px', height: '3px',
        backgroundColor: 'green', top: '12px', left: '36px'
      }}>

      </div>
      {/* Braço direito */}
      <div style={{
        position: 'relative', width: '4px', height: '9px',
        backgroundColor: 'red', top: '-12px', left: '59px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '4px', height: '3px',
        backgroundColor: 'green', top: '-12px', left: '59px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '4px', height: '9px',
        backgroundColor: 'red', top: '-12px', left: '59px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '4px', height: '3px',
        backgroundColor: 'green', top: '-12px', left: '59px'
      }}>

      </div>
      {/* tronco */}
      <div style={{
        position: 'relative', width: '19px', height: '22px',
        backgroundColor: 'yellow', top: '-38px', left: '40px'
      }}>

      </div>
      {/* perna esquerda*/}
      <div style={{
        position: 'relative', width: '8px', height: '9px',
        backgroundColor: 'blue', top: '-38px', left: '40px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '8px', height: '3px',
        backgroundColor: 'purple', top: '-38px', left: '40px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '8px', height: '11px',
        backgroundColor: 'blue', top: '-38px', left: '40px'
      }}>

      </div>

      {/* perna direita */}
      <div style={{
        position: 'relative', width: '8px', height: '9px',
        backgroundColor: 'blue', top: '-61px', left: '51px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '8px', height: '3px',
        backgroundColor: 'purple', top: '-61px', left: '51px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '8px', height: '11px',
        backgroundColor: 'blue', top: '-61px', left: '51px'
      }}>

      </div>
        </>
      )}
      
    </div>
  );
}