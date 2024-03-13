// import './ListHeader.css'; // Import the CSS file
// const ListHeader = ({text}) => {
//   return (
//     <div className='grid-container text-muted'>
//       {text.map((item, index) => (
//         <h5 key={index} className='column'>
//           {item}
//         </h5>
//       ))}
//     </div>
//   );
// };

// export default ListHeader;

import './ListHeader.css';

const ListHeader = ({text, flexStyles}) => {
  return (
    <div className='list-container'>
      <ul className='flex-container text-muted'>
        {text.map((item, index) => (
          <li key={index} style={{flex: flexStyles ? (flexStyles[index] ? flexStyles[index] : 1) : 1}}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListHeader;
