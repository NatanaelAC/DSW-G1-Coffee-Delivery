import { Coffee, Package, ShoppingCart, Timer } from '@phosphor-icons/react';
import { useTheme } from 'styled-components';

import { Card } from '../../components/Card';

import { api } from '../../servers/api'; // Verifique se o caminho é 'servers' ou 'serves'

import { CoffeeList, Heading, Hero, HeroContent, Info } from './styles';
import { useEffect, useState } from 'react';


interface CoffeeType {
  id: string;
  nome: string;
  descricao: string;
  tag: string[];
  preco: string;
  image?: string; // Tornando opcional, caso sua API não retorne
};


export function Home() {
  const theme = useTheme();
  const [coffees, setCoffees] = useState<CoffeeType[]>([]);

  useEffect(() => {
    async function fetchCoffees() {
      try {
        const response = await api.get<CoffeeType[]>('http://localhost:3000/coffees');
        setCoffees(response.data);
        console.log({ coffees: response.data });
      } catch (error) {
        console.error("Erro ao buscar os cafés:", error);
      }
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
            <Card
              key={coffee.id}
              coffee={{
                id: coffee.id,
                title: coffee.nome,
                description: coffee.descricao,
                tags: coffee.tag,
                price: parseFloat(coffee.preco),
                image: coffee.image || `/src/assets/coffees/${coffee.id}.png`,
              }}
            />
          ))}
        </div>

      </CoffeeList>
    </div>
  );
}