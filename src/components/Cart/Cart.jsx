import { useContext, useState } from 'react';
import Modal from '../UI/Modal';
import CartContext from '../../store/CartContext';
import CartItem from './CartItem';
import Checkout from './Checkout';
import classes from './Cart.module.css';

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [submittedItems, setSubmittedItems] = useState([]);
  const [submittedTotal, setSubmittedTotal] = useState(0);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  function cartItemRemoveHandler(id) {
    cartCtx.removeItem(id);
  }

  function cartItemAddHandler(item) {
    cartCtx.addItem({ ...item, amount: 1 });
  }

  function orderClickHandler() {
    setIsCheckout(true);
  }

  function submitOrderHandler(userData) {
    console.log('Order submitted:', userData, cartCtx.items);
    setSubmittedItems(cartCtx.items);    
    setSubmittedTotal(cartCtx.totalAmount); 
    setDidSubmit(true);
  }

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.length === 0 && <p>Your cart is empty!</p>}
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes['button--alt']} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderClickHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
      {!isCheckout && modalActions}
    </>
  );

  function closeAfterOrderHandler() {   // ADD THIS FUNCTION
    cartCtx.clearCart();
    props.onClose();
  }

  const didSubmitModalContent = (
    <>
      <p>Successfully sent the order!</p>
      <ul className={classes['cart-items']}>
        {submittedItems.map((item) => (
          <li key={item.id}>
            {item.name} — x{item.amount} (${(item.price * item.amount).toFixed(2)})
          </li>
        ))}
      </ul>
      <div className={classes.total}>
        <span>Total Paid</span>
        <span>${submittedTotal.toFixed(2)}</span>
      </div>
      <div className={classes.actions}>
        <button className={classes.button} onClick={closeAfterOrderHandler}>
          Close
        </button>
      </div>
    </>
  );

  return <Modal onClose={props.onClose}>{!didSubmit ? cartModalContent : didSubmitModalContent}</Modal>;
};

export default Cart;