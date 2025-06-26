import { Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Bank,
  CreditCard,
  CurrencyDollar,
  MapPin,
  Money,
  Trash,
} from '@phosphor-icons/react';

import { useCart } from '../../hooks/useCart';
import { QuantityInput } from '../../components/Form/QuantityInput';
import { TextInput } from '../../components/Form/TextInput';
import { Radio } from '../../components/Form/Radio';
import { getCoffeeById } from '../../services/coffeeApi';

import {
  AddressContainer,
  AddressForm,
  AddressHeading,
  CartTotal,
  CartTotalInfo,
  CheckoutButton,
  Coffee,
  CoffeeInfo,
  Container,
  InfoContainer,
  PaymentContainer,
  PaymentErrorMessage,
  PaymentHeading,
  PaymentOptions,
} from './styles';

type FormInputs = {
  cep: number;
  street: string;
  number: string;
  fullAddress: string;
  neighborhood: string;
  city: string;
  state: string;
  paymentMethod: 'credit' | 'debit' | 'cash';
};

type CoffeeDetailFromBackend = {
  id: string;
  nome: string;
  descricao: string;
  tag: string[];
  preco: string;
  image?: string;
  date_create: string;
};

type CartCoffeeItem = CoffeeDetailFromBackend & {
  quantity: number;
  title: string;
  description: string;
};

const newOrder = z.object({
  cep: z.number({ invalid_type_error: 'Informe o CEP' }),
  street: z.string().min(1, 'Informe a rua'),
  number: z.string().min(1, 'Informe o número'),
  fullAddress: z.string(),
  neighborhood: z.string().min(1, 'Informe o bairro'),
  city: z.string().min(1, 'Informe a cidade'),
  state: z.string().min(1, 'Informe a UF'),
  paymentMethod: z.enum(['credit', 'debit', 'cash'], {
    invalid_type_error: 'Informe um método de pagamento',
  }),
});

export type OrderInfo = z.infer<typeof newOrder>;

const shippingPrice = 3.5;

export function Cart() {
  const {
    cart,
    checkout,
    incrementItemQuantity,
    decrementItemQuantity,
    removeItem,
  } = useCart();

  const [coffeesInCartWithDetails, setCoffeesInCartWithDetails] = useState<CartCoffeeItem[]>([]);
  const [loadingCartDetails, setLoadingCartDetails] = useState(true);
  const [errorLoadingCartDetails, setErrorLoadingCartDetails] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCoffeeDetails() {
      setLoadingCartDetails(true);
      setErrorLoadingCartDetails(null);
      try {
        if (cart.length === 0) {
          setCoffeesInCartWithDetails([]);
          setLoadingCartDetails(false);
          return;
        }

        const detailedCoffeesPromises = cart.map(async (item) => {
          const coffeeInfo = await getCoffeeById(item.id);
          // Adiciona uma verificação extra para garantir que coffeeInfo não é null ou undefined
          if (!coffeeInfo) {
            console.warn(`Café com ID "${item.id}" não encontrado na API ou retorno inválido.`);
            // Você pode decidir pular este item ou lançar um erro
            return null; // Retorna null para que possa ser filtrado depois
          }

          // Garante que 'tag' seja sempre um array
          const safeTags = Array.isArray(coffeeInfo.tag) ? coffeeInfo.tag : [];

          return {
            ...coffeeInfo,
            quantity: item.quantity,
            title: coffeeInfo.nome,
            description: coffeeInfo.descricao,
            tag: safeTags,
            // Usa um fallback de imagem se coffeeInfo.image for undefined/null
            image: coffeeInfo.image || `/src/assets/coffees/${coffeeInfo.id}.png`
          } as CartCoffeeItem;
        }).filter(Boolean); // Filtra quaisquer itens 'null' resultantes de cafés não encontrados

        const resolvedDetailedCoffees = await Promise.all(detailedCoffeesPromises);
        // Garante que o resultado final é um array de CartCoffeeItem, removendo os nulos
        setCoffeesInCartWithDetails(resolvedDetailedCoffees.filter((coffee): coffee is CartCoffeeItem => coffee !== null));
      } catch (error: any) {
        console.error("Erro ao carregar detalhes dos cafés do carrinho:", error);
        setErrorLoadingCartDetails(error.message || "Erro ao carregar detalhes dos cafés.");
        setCoffeesInCartWithDetails([]);
      } finally {
        setLoadingCartDetails(false);
      }
    }

    fetchCoffeeDetails();
  }, [cart]);

  const totalItemsPrice = coffeesInCartWithDetails.reduce((previousValue, currentItem) => {
    // Garante que currentItem.preco é uma string e tem um valor padrão '0' se for nulo/indefinido
    const priceAsString = String(currentItem.preco || '0');
    const priceAsNumber = parseFloat(priceAsString.replace('R$', '').replace(',', '.'));
    // Adiciona uma verificação para garantir que priceAsNumber é um número válido
    return (previousValue += (isNaN(priceAsNumber) ? 0 : priceAsNumber) * currentItem.quantity);
  }, 0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(newOrder),
  });

  const selectedPaymentMethod = watch('paymentMethod');

  function handleItemIncrement(itemId: string) {
    incrementItemQuantity(itemId);
  }

  function handleItemDecrement(itemId: string) {
    decrementItemQuantity(itemId);
  }

  function handleItemRemove(itemId: string) {
    removeItem(itemId);
  }

  const handleOrderCheckout: SubmitHandler<FormInputs> = (data) => {
    if (cart.length === 0) {
      alert('É preciso ter pelo menos um item no carrinho');
      return; // Adicionado 'return' para parar a execução após o alert
    }

    checkout(data);
  };

  return (
    <Container>
      <InfoContainer>
        <h2>Complete seu pedido</h2>

        <form id="order" onSubmit={handleSubmit(handleOrderCheckout)}>
          <AddressContainer>
            <AddressHeading>
              <MapPin size={22} />
              <div>
                <span>Endereço de Entrega</span>
                <p>Informe o endereço onde deseja receber o seu pedido</p>
              </div>
            </AddressHeading>

            <AddressForm>
              <TextInput
                placeholder="CEP"
                type="number"
                containerProps={{ style: { gridArea: 'cep' } }}
                error={errors.cep}
                {...register('cep', { valueAsNumber: true })}
              />
              <TextInput
                placeholder="Rua"
                containerProps={{ style: { gridArea: 'street' } }}
                error={errors.street}
                {...register('street')}
              />
              <TextInput
                placeholder="Número"
                containerProps={{ style: { gridArea: 'number' } }}
                error={errors.number}
                {...register('number')}
              />
              <TextInput
                placeholder="Complemento"
                optional
                containerProps={{ style: { gridArea: 'fullAddress' } }}
                error={errors.fullAddress}
                {...register('fullAddress')}
              />
              <TextInput
                placeholder="Bairro"
                containerProps={{ style: { gridArea: 'neighborhood' } }}
                error={errors.neighborhood}
                {...register('neighborhood')}
              />
              <TextInput
                placeholder="Cidade"
                containerProps={{ style: { gridArea: 'city' } }}
                error={errors.city}
                {...register('city')}
              />
              <TextInput
                placeholder="UF"
                maxLength={2}
                containerProps={{ style: { gridArea: 'state' } }}
                error={errors.state}
                {...register('state')}
              />
            </AddressForm>
          </AddressContainer>

          <PaymentContainer>
            <PaymentHeading>
              <CurrencyDollar size={22} />
              <div>
                <span>Pagamento</span>
                <p>
                  O pagamento é feito na entrega. Escolha a forma que deseja
                  pagar
                </p>
              </div>
            </PaymentHeading>

            <PaymentOptions>
              <div>
                <Radio
                  isSelected={selectedPaymentMethod === 'credit'}
                  {...register('paymentMethod')}
                  value="credit"
                >
                  <CreditCard size={16} />
                  <span>Cartão de crédito</span>
                </Radio>
                <Radio
                  isSelected={selectedPaymentMethod === 'debit'}
                  {...register('paymentMethod')}
                  value="debit"
                >
                  <Bank size={16} />
                  <span>Cartão de débito</span>
                </Radio>
                <Radio
                  isSelected={selectedPaymentMethod === 'cash'}
                  {...register('paymentMethod')}
                  value="cash"
                >
                  <Money size={16} />
                  <span>Dinheiro</span>
                </Radio>
              </div>

              {errors.paymentMethod ? (
                <PaymentErrorMessage role="alert">
                  {errors.paymentMethod.message}
                </PaymentErrorMessage>
              ) : null}
            </PaymentOptions>
          </PaymentContainer>
        </form>
      </InfoContainer>

      <InfoContainer>
        <h2>Cafés selecionados</h2>

        <CartTotal>
          {loadingCartDetails ? (
            <p>Carregando itens do carrinho...</p>
          ) : errorLoadingCartDetails ? (
            <p style={{ color: 'red' }}>{errorLoadingCartDetails}</p>
          ) : coffeesInCartWithDetails.length === 0 ? (
            <p>Seu carrinho está vazio!</p>
          ) : (
            coffeesInCartWithDetails.map((coffee) => (
              <Fragment key={coffee.id}>
                <Coffee>
                  <div>
                    {/* Imagem do café: usa a imagem fornecida ou um placeholder */}
                    <img src={coffee.image || '/src/assets/coffees/default_coffee.png'} alt={coffee.title} />

                    <div>
                      <span>{coffee.title}</span>
                      <CoffeeInfo>
                        <QuantityInput
                          quantity={coffee.quantity}
                          incrementQuantity={() => handleItemIncrement(coffee.id)}
                          decrementQuantity={() => handleItemDecrement(coffee.id)}
                        />
                        <button onClick={() => handleItemRemove(coffee.id)}>
                          <Trash />
                          <span>Remover</span>
                        </button>
                      </CoffeeInfo>
                    </div>
                  </div>

                  <aside>
                    {/* Preço do café: formatação robusta para evitar NaN ou undefined */}
                    R$ {
                      parseFloat(
                        String(coffee.preco || '0').replace('R$', '').replace(',', '.')
                      ).toFixed(2).replace('.', ',')
                    }
                  </aside>
                </Coffee>
                <span />
              </Fragment>
            ))
          )}

          <CartTotalInfo>
            <div>
              <span>Total de itens</span>
              <span>
                {new Intl.NumberFormat('pt-br', {
                  currency: 'BRL',
                  style: 'currency',
                }).format(totalItemsPrice)}
              </span>
            </div>

            <div>
              <span>Entrega</span>
              <span>
                {new Intl.NumberFormat('pt-br', {
                  currency: 'BRL',
                  style: 'currency',
                }).format(shippingPrice)}
              </span>
            </div>

            <div>
              <span>Total</span>
              <span>
                {new Intl.NumberFormat('pt-br', {
                  currency: 'BRL',
                  style: 'currency',
                }).format(totalItemsPrice + shippingPrice)}
              </span>
            </div>
          </CartTotalInfo>

          <CheckoutButton type="submit" form="order">
            Confirmar pedido
          </CheckoutButton>
        </CartTotal>
      </InfoContainer>
    </Container>
  );
}