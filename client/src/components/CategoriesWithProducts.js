import React from 'react';
import Categories from './Categories';
import Products from './Products';

const CategoriesAndProducts = () => 
        <div className="row">
            <div className="col-sm-2" style={{ marginTop: '42px' }}>      
              <div className="column"><Categories /></div>
            </div>
            <div className="col-sm-10"> 
              <div className="column"><Products /></div>
            </div>
        </div>;

export default CategoriesAndProducts;
