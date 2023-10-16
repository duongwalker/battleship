import { useDroppable } from '@dnd-kit/core';

function Droppable (props: any) {
    const { setNodeRef } = useDroppable({
        id: props.id,
    });

    return (
        <div ref={setNodeRef}>
            {props.children}
        </div>
    );
}

// function MultipleDroppables() {
//     const droppables = ['1', '2', '3', '4'];
  
//     return (
//       <section>
//         {droppables.map((id) => (
//           <Droppable id={id} key={id}>
//             Droppable container id: ${id}
//           </Droppable>
//         ))}
//       </section>
//     );
// }