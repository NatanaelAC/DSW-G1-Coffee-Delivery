import { CheckFat, ShoppingCart } from '@phosphor-icons/react';
import { useTheme } from 'styled-components';
import { useEffect, useState } from 'react';

import { QuantityInput } from '../Form/QuantityInput';
import { useCart } from '../../hooks/useCart';
import {
  CoffeeImg,
  Container,
  Control,
  Description,
  Order,
  Price,
  Tags,
  Title,
} from './styles';

type Props = {
  coffee: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    price: number; 
    image: string;
  };
};

export function Card({ coffee }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isItemAdded, setIsItemAdded] = useState(false);
  const theme = useTheme();
  const { addItem } = useCart();

  function incrementQuantity() {
    setQuantity((state) => state + 1);
  }

  function decrementQuantity() {
    if (quantity > 1) {
      setQuantity((state) => state - 1);
    }
  }

  function handleAddItem() {
    addItem({ id: coffee.id, quantity });
    setIsItemAdded(true);
    setQuantity(1);
  }

  useEffect(() => {
    let timeout: number | undefined;

    if (isItemAdded) {
      timeout = setTimeout(() => {
        setIsItemAdded(false);
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isItemAdded]);

  const safeTags = Array.isArray(coffee.tags) ? coffee.tags : [];

  const rawPriceString = String(coffee.price || '0')
    .replace('R$', '')
    .replace(',', '.')
    .trim();
  const parsedPrice = parseFloat(rawPriceString);

  const formattedPrice = isNaN(parsedPrice)
    ? '0,00'
    : parsedPrice.toFixed(2).replace('.', ',');

  return (
    <Container>
      <CoffeeImg src={coffee.image || '/src/assets/coffees/default_coffee.png'} alt={coffee.title} />

      <Tags>
        {safeTags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </Tags>

      <Title>{coffee.title}</Title>

      <Description>{coffee.description}</Description>

      <Control>
        <Price>
          <span>R$</span>
          <span>{formattedPrice}</span>
        </Price>

        <Order $itemAdded={isItemAdded}>
          <QuantityInput
            quantity={quantity}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />

          <button disabled={isItemAdded} onClick={handleAddItem}>
            {isItemAdded ? (
              <CheckFat
                weight="fill"
                size={22}
                color={theme.colors['base-card']}
              />
            ) : (
              <ShoppingCart size={22} color={theme.colors['base-card']} />
            )}
          </button>
        </Order>
      </Control>
    </Container>
  );
}