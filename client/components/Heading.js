import React from 'react'

function Heading() {
  return (
    <div className='main-headingcontainer'>
         <h2 className="qotd-heading">Top 10</h2>
            <p className="qotd-date">
              <i className="fas fa-calendar-alt" style={{ marginRight: '10px' }}></i>
              {(() => {
                const [year, month, day] = new Date().toISOString().split('T')[0]
                  .split('-')
                  .map(Number);
                const localDate = new Date(year, month - 1, day);
                return localDate.toLocaleDateString();
              })()}
            </p>
    </div>
  )
}

export default Heading
