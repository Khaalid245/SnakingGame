// src/components/SnakeBody.js
function SnakeBody({ snake }) {
    return (
      <>
        {snake.map((segment, index) => (
          <div
            key={index}
            className="w-[30px] h-[30px] border border-gray-300 bg-green-500"
            style={{ gridRowStart: segment.y + 1, gridColumnStart: segment.x + 1 }}
          ></div>
        ))}
      </>
    );
  }
  
  export default SnakeBody;
  