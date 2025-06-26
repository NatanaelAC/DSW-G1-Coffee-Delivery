import { Coffee, Package, ShoppingCart, Timer } from '@phosphor-icons/react'
import { useTheme } from 'styled-components'

import { Card } from '../../components/Card'

import { api } from '../../servers/api';
import { CoffeeList, Heading, Hero, HeroContent, Info } from './styles'
import { useEffect, useState } from 'react';
<<<<<<< HEAD
=======
import { api } from '../../serves/api';
>>>>>>> dd7d6f4a7eae6451bd6ecb9268c45959f5e72b21

interface Coffee {
  id: string;
  title: string;
  description: string ;
  tags: string[];
  price: number;
  image: string;
  quantity: number;
  favorite: boolean;
};
//const [userData, setUserData] = useState<GitHubUser | null>(null);
//const [issues, setIssues] = useState<GitHubIssue[]>([]);
export function Home() {
  const theme = useTheme();
<<<<<<< HEAD
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  
  useEffect(() => {
    async function fetchCoffees() {
      const response = await api('/coffees');
      setCoffees(response.data);
=======
  const[data,setuserdata]= useState<Coffee | null>(null);
  const [coffees, setCoffes] = useState<Coffee[]>([]);//<GitHubUser | null>(null);

  useEffect(() => {
    async function fechCoffe() {
      try {
        const response = await api.get<Coffee>('http://localhost:3000/coffees');
        setuserdata(response.data);

      } catch (error) {
        console.error("Erro ao buscar o café")
      }

    }


fechCoffe();
  }, []);

 

  function incrementQuantity(id: string) {
    // Aqui você pode fazer a lógica para incrementar a quantidade do café
  }
>>>>>>> dd7d6f4a7eae6451bd6ecb9268c45959f5e72b21

      console.log({coffees: response.data});
    }
    fetchCoffees();
  }, []);

  return (
    <div>
      <Hero>
        <HeroContent>
          <div>
            <Heading>
              <h1>Encontre o café perfeito para qualquer hora do dia</h1>

              <span>
                Com o Coffee Delivery você recebe seu café onde estiver, a
                qualquer hora
              </span>
            </Heading>

            <Info>
              <div>
                <ShoppingCart
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors['yellow-dark'] }}
                />
                <span>Compra simples e segura</span>
              </div>

              <div>
                <Package
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors['base-text'] }}
                />
                <span>Embalagem mantém o café intacto</span>
              </div>

              <div>
                <Timer
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors.yellow }}
                />
                <span>Entrega rápida e rastreada</span>
              </div>

              <div>
                <Coffee
                  size={32}
                  weight="fill"
                  color={theme.colors.background}
                  style={{ backgroundColor: theme.colors.purple }}
                />
                <span>O café chega fresquinho até você</span>
              </div>
            </Info>
          </div>

          <img src="/images/hero.svg" alt="Café do Coffee Delivery" />
        </HeroContent>

        <img src="/images/hero-bg.svg" id="hero-bg" alt="" />
      </Hero>

      <CoffeeList>
        <h2>Nossos cafés</h2>

        <div>
          {coffees.map((coffee) => (
<<<<<<< HEAD
            <Card key={coffee.id} coffee={coffee} />
          ))}
=======
            <CoffeeCard  coffee={{
              description:coffee.description,
              id: coffee.id,
              image: coffee.image,
              price: coffee.price,
              tags: coffee.tags,
              title: coffee.title,
              quantity: coffee.quantity
            }}
            
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
            />
          ))} 
>>>>>>> dd7d6f4a7eae6451bd6ecb9268c45959f5e72b21
        </div>
        
      </CoffeeList>
    </div>
  )
}
