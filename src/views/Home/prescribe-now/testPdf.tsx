import React from 'react';

const TestPdf = (props: {name: String, list: any}) => {
  return (
    <div style={{color:'red', width: '100%'}}>
      <h2>TD elements define table {props.name}</h2>
      {
            props?.list?.map((item: any, index: any) => (<li key={index}> {item} ghbnjkljhgj</li>))
        }
      <table>
        <tr>
          <td>Emil</td>
          <td>Tobias</td>
          <td>Linus</td>
        </tr>
      </table>
      <ul>
        
      </ul>

      <p>To understand the example better, we have added borders to the table.</p>
    </div>
  );
};

export default TestPdf;
