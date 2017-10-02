import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CategoriesWithProducts from './components/CategoriesWithProducts';
import Orders from './components/Orders';
import { Categories, EditCategory, DeleteCategory } from './components/admin/Category';
import { Products, AddProduct, EditProduct, DeleteProduct } from './components/admin/Product';
import { Users, SignupUser, SigninUser } from './components/admin/User';
import requireAuth from './components/requireAuth';
import Header from './components/Header';

export default 
    (
        <div>     
            <Switch> 
                <Route exact path="/" component={CategoriesWithProducts} />             
                <Route path="/categories" component={requireAuth(Categories)} />        
                <Route path="/category/edit/:id" component={requireAuth(EditCategory)} />
                <Route path="/category/delete/:id" component={requireAuth(DeleteCategory)} />
                <Route path="/category/products/:id" component={Products} />               
                <Route path="/product/new/:catId" component={requireAuth(AddProduct)} />
                <Route path="/product/edit/:catId/:id" component={requireAuth(EditProduct)} />
                <Route path="/product/delete/:catId/:id" component={requireAuth(DeleteProduct)} />
                <Route path="/orders" component={requireAuth(Orders)} />
                <Route path="/users" component={requireAuth(Users)} />   
                <Route path="/signup" component={SignupUser} />   
                <Route path="/signin" component={SigninUser} />                 
                <Route path="/:id([0-9a-fA-F]{24})/" component={CategoriesWithProducts} />
            </Switch>
            <div><Header /></div>  
        </div>    
    );

