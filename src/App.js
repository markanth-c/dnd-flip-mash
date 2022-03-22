import React, { useState } from "react";
import "./App.scss";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// import { v4 as uuid } from "uuid";

// define columns containing items
const columnStarts = {
  healthy: "Healthy Foods",
};

// define categories
const categories = {
  Fruit: "Fruit",
  Veggie: "Vegetable",
};

// sample db
const itemsFromBackend = [
  {
    id: "0",
    content: "🎃 Squash 🎃",
    description: "The antioxidants in squash can play an important role in reducing oxidative stress.",
    category: categories.Fruit,
  },
  {
    id: "1",
    content: "🥕 Carrot 🥕",
    description: "The fiber in carrots can help keep blood sugar levels under control.",
    category: categories.Veggie,
  },
  {
    id: "2",
    content: "🥔 Potato 🥔",
    description: "Potatoes are a good source of fiber, which keeps you full longer.",
    category: categories.Veggie,
  },
  {
    id: "3",
    content: "🥒 Cucumber 🥒",
    description: "Cucumber has been found to decrease bad cholesterol and blood sugar levels.",
    category: categories.Fruit,
  },
  {
    id: "4",
    content: "🥦 Broccoli 🥦",
    description: "Broccoli helps reduce inflammation, boost immunity and promote heart health",
    category: categories.Veggie,
  },
  {
    id: "5",
    content: "🥜 Peanut 🥜",
    description: "Peanuts are an especially good source of healthful fats, protein, and fiber.",
    category: categories.Fruit,
  },
];

const columnsFromBackend = {
  0: {
    name: columnStarts.healthy,
    items: itemsFromBackend,
  },
  1: {
    name: categories.Fruit,
    items: [],
  },
  2: {
    name: categories.Veggie,
    items: [],
  },
};

// replace og paramter name w generic wordings
const onDragEnd = (result, Columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = Columns[source.droppableId];
    const destColumn = Columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...Columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = Columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...Columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

// store info from recent hover item
const whoHover = {
  id: "",
  IsBackShown: false,
};


// function getDisableStatus(friendID) {
//   const [isOnline, setIsOnline] = useState(null);

//   // ...

//   return isOnline;
// }

// main
function App() {
  const [Columns, setColumns] = useState(columnsFromBackend);
  const [recentHover, setIsBackShown] = useState(whoHover); // for updating class css
  const [isDisableDND, setIsDisableDND] = useState(false); // prevent dnd function
  return (
    <>
      <div className="context-wrapper">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, Columns, setColumns)}
        >
          {Object.entries(Columns).map(([columnId, column], index) => {
            return (
              <div className="column-wrap" key={columnId}>
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable
                    droppableId={columnId}
                    key={columnId}
                    isDropDisabled={isDisableDND}
                  >
                    {(provided, snapshot) => {
                      return (
                        <div
                          className="dropbox"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            filter: snapshot.isDraggingOver
                              ? "#eee"
                              : "#ddd",
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                                isDragDisabled={isDisableDND}
                              >
                                {(provided, snapshot) => {
                                  // controls flip of card
                                  function setClass() {
                                    const container = "card-container";
                                    if (recentHover.id === item.id) {
                                      return recentHover.IsBackShown
                                        ? container + " flipped"
                                        : container;
                                    } else {
                                      return container;
                                    }
                                  }
                                  // categorize result
                                  function isCorrect() {
                                    if (isDisableDND) {
                                      if (
                                        Columns[columnId].name === item.category
                                      ) {
                                        return true;
                                      }
                                    }
                                  }
                                  // added bg change block based on result
                                  function setBGColor() {
                                    if (!isDisableDND) {
                                      return snapshot.isDragging
                                        ? "linear-gradient(#964B0088, #FFFF00FF)"
                                        : "radial-gradient(#964B0088, #FFFF00FF)";
                                    } else {
                                      return isCorrect()
                                        ? "rgba(0,255,0,0.5)"
                                        : "rgba(255,0,0,0.5)";
                                    }
                                  }
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        background: setBGColor(),
                                        ...provided.draggableProps.style,
                                      }}
                                      // magic here
                                      className={setClass()}
                                      onMouseEnter={() => {
                                        setIsBackShown({
                                          id: item.id,
                                          IsBackShown: true,
                                        });
                                      }}
                                      onMouseLeave={() => {
                                        setIsBackShown({
                                          id: item.id,
                                          IsBackShown: false,
                                        });
                                      }}
                                    >
                                      <div className="front">
                                        <p>{item.content}</p>
                                      </div>
                                      <div className="back">
                                        <p>{item.description}</p>
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>

      {/* submit/reset button */}
      <div className="button">
        {Columns[0].items.length === 0 ? (
          !isDisableDND ?
          <button onClick={() => setIsDisableDND(true)}>Check</button> :
          <button onClick={() => window.location.reload(false)}>Reset</button>
        ) : (
          <button disabled={true}>Check</button>
        )}
      </div>
    </>
  );
}

export default App;
