import { useEffect, useState } from "react";



export default function CharacterMovingRight(body) {
  
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
        position: 'relative', width: '15px', height: '14px',
        backgroundColor: 'white', top: '10px', left: '42px'
      }}>

        <div style={{
          position: 'relative', width: '3px', height: '5px',
          backgroundColor: 'black', top: '3px', left: '9px'
        }}>

        </div>
        <div style={{
          position: 'relative', width: '4px', height: '2px',
          backgroundColor: 'black', top: '5px', left: '11px'
        }}>

        </div>
      </div>

      {/* Braço esquerdo */}
      <div style={{
        position: 'relative', width: '4px', height: '9px',
        backgroundColor: 'red', top: '12px', left: '48px',zIndex: 1
      }}>

      </div>
      <div style={{
        position: 'relative', width: '4px', height: '3px',
        backgroundColor: 'green', top: '12px', left: '48px',zIndex: 1
      }}>

      </div>
      <div style={{
        position: 'relative', width: '4px', height: '9px',
        backgroundColor: 'red', top: '12px', left: '48px',zIndex: 1
      }}>

      </div>
      <div style={{
        position: 'relative', width: '4px', height: '3px',
        backgroundColor: 'green', top: '12px', left: '48px',zIndex: 1
      }}>

      </div>
      {/* Braço direito */}
      <div style={{
        position: 'relative', width: '4px', height: '9px',
        top: '-12px', left: '59px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '4px', height: '3px',
         top: '-12px', left: '59px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '4px', height: '9px',
         top: '-12px', left: '59px'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '4px', height: '3px',
         top: '-12px', left: '59px'
      }}>

      </div>
      {/* tronco */}
      <div style={{
        position: 'relative', width: '12px', height: '22px',
        backgroundColor: 'yellow', top: '-38px', left: '43px'
      }}>

      </div>
      {/* perna esquerda*/}
      <div style={{
        position: 'relative', width: '8px', height: '9px',
        backgroundColor: 'blue', top: '-39px', left: '47px',rotate: '-25deg'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '8px', height: '3px',
        backgroundColor: 'purple', top: '-40px', left: '49px',rotate: '-15deg'
      }}>

      </div>
      <div style={{
        position: 'relative', width: '8px', height: '11px',
        backgroundColor: 'blue', top: '-41px', left: '50px',rotate: '-10deg'
      }}>

      </div>

      {/* perna direita */}
      <div style={{
        position: 'relative', width: '8px', height: '9px',
        top: '-61px', left: '45px', backgroundColor: 'blue',rotate: '25deg',zIndex: 1
      }}>

      </div>
      <div style={{
        position: 'relative', width: '8px', height: '3px',
        top: '-62px', left: '43px',zIndex: 1, backgroundColor: 'purple',rotate: '15deg'
      }}>

      </div>
      <div style={{
       position: 'relative', width: '8px', height: '11px',
       backgroundColor: 'blue', top: '-63px', left: '41px',rotate: '20deg',zIndex: 1
      }}>

      </div>
      </>
      )}
      {frame === 2 && (
        <>
        {/* cabeça */}
        <div style={{
          position: 'relative', width: '15px', height: '14px',
          backgroundColor: 'white', top: '10px', left: '42px'
        }}>
  
          <div style={{
            position: 'relative', width: '3px', height: '5px',
            backgroundColor: 'black', top: '3px', left: '9px'
          }}>
  
          </div>
          <div style={{
            position: 'relative', width: '4px', height: '2px',
            backgroundColor: 'black', top: '5px', left: '11px'
          }}>
  
          </div>
        </div>
  
        {/* Braço esquerdo */}
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          backgroundColor: 'red', top: '12px', left: '48px',zIndex: 1
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
          backgroundColor: 'green', top: '12px', left: '48px',zIndex: 1
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          backgroundColor: 'red', top: '12px', left: '48px',zIndex: 1
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
          backgroundColor: 'green', top: '12px', left: '48px',zIndex: 1
        }}>
  
        </div>
        {/* Braço direito */}
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          top: '-12px', left: '59px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
           top: '-12px', left: '59px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '4px', height: '9px',
           top: '-12px', left: '59px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
           top: '-12px', left: '59px'
        }}>
  
        </div>
        {/* tronco */}
        <div style={{
          position: 'relative', width: '12px', height: '22px',
          backgroundColor: 'yellow', top: '-38px', left: '43px'
        }}>
  
        </div>
        {/* perna esquerda*/}
        <div style={{
          position: 'relative', width: '8px', height: '9px',
          backgroundColor: 'blue', top: '-38px', left: '45px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '8px', height: '3px',
          backgroundColor: 'purple', top: '-38px', left: '45px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '8px', height: '11px',
          backgroundColor: 'blue', top: '-38px', left: '45px'
        }}>
  
        </div>
  
        {/* perna direita */}
        <div style={{
          position: 'relative', width: '8px', height: '9px',
          top: '-61px', left: '51px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '8px', height: '3px',
          top: '-61px', left: '51px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '8px', height: '11px',
           top: '-61px', left: '51px'
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
  
          <div style={{
            position: 'relative', width: '3px', height: '5px',
            backgroundColor: 'black', top: '3px', left: '9px'
          }}>
  
          </div>
          <div style={{
            position: 'relative', width: '4px', height: '2px',
            backgroundColor: 'black', top: '5px', left: '11px'
          }}>
  
          </div>
        </div>
  
        {/* Braço esquerdo */}
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          backgroundColor: 'red', top: '12px', left: '48px',zIndex: 1
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
          backgroundColor: 'green', top: '12px', left: '48px',zIndex: 1
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          backgroundColor: 'red', top: '12px', left: '48px',zIndex: 1
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
          backgroundColor: 'green', top: '12px', left: '48px',zIndex: 1
        }}>
  
        </div>
        {/* Braço direito */}
        <div style={{
          position: 'relative', width: '4px', height: '9px',
          top: '-12px', left: '59px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
           top: '-12px', left: '59px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '4px', height: '9px',
           top: '-12px', left: '59px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '4px', height: '3px',
           top: '-12px', left: '59px'
        }}>
  
        </div>
        {/* tronco */}
        <div style={{
          position: 'relative', width: '12px', height: '22px',
          backgroundColor: 'yellow', top: '-38px', left: '43px'
        }}>
  
        </div>
        {/* perna esquerda*/}
        <div style={{
          position: 'relative', width: '8px', height: '9px',
          backgroundColor: 'blue', top: '-38px', left: '45px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '8px', height: '3px',
          backgroundColor: 'purple', top: '-38px', left: '45px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '8px', height: '11px',
          backgroundColor: 'blue', top: '-38px', left: '45px'
        }}>
  
        </div>
  
        {/* perna direita */}
        <div style={{
          position: 'relative', width: '8px', height: '9px',
          top: '-61px', left: '51px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '8px', height: '3px',
          top: '-61px', left: '51px'
        }}>
  
        </div>
        <div style={{
          position: 'relative', width: '8px', height: '11px',
           top: '-61px', left: '51px'
        }}>
  
        </div>
        </>
      )}
      
    </div>
  );
}