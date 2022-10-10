import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Grid, Link, Divider, Container, Typography, Stack } from '@mui/material';
import { Logo } from 'src/components/Logo';
import { SocialsButton } from 'src/components/SocialButton';
import { SOCIALS } from 'src/config';

const LINKS = [
  {
    headline: 'win.so',
    children: [
      //TODO: replace this by using the Routes config fas the source of truth
      {
        name: 'About',
        href: '/about'
      },
      {
        name: 'Frequently Asked Questions',
        href: '/faq'
      },
      {
        name: 'Give us your Feedback 💚',
        href: 'https://winwindao.typeform.com/win-feedback',
        target: '_blank',
        rel: 'noopener',
        external: true
      }
    ]
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and Conditions', href: '/terms' },
      { name: 'Privacy and Cookie Policy', href: '/privacy' }
    ]
  },
  {
    headline: 'Contact',
    children: [
      {
        name: 'hi@windingtree.com',
        href: 'mailto:hi@windingtree.com',
        external: true
      },
      {
        name: 'Newsletter',
        href: 'https://win.us11.list-manage.com/subscribe?u=4bee30e4f48a27acab75b9ef7&id=f0fcc18337',
        target: '_blank',
        rel: 'noopener',
        external: true
      }
    ]
  }
];

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default
}));

export default function MainFooter() {
  return (
    <RootStyle>
      <Divider />
      <Container sx={{ pt: 10, pb: 10 }}>
        <Grid
          container
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ textAlign: { xs: 'left' } }}
        >
          <Grid
            item
            xs={12}
            sx={{ mb: 3, textAlign: 'left' }}
            style={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            <Logo sx={{ mx: { xs: 'auto', md: 'inherit' } }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              Win.so an accommodation marketplace for the crypto community and digital
              nomads. Website powered by&nbsp;
              <Link
                href="https://windingtree.com"
                underline="hover"
                target="_blank"
                rel="noopener"
              >
                Winding Tree
              </Link>
            </Typography>

            <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{ mt: 5, mb: { xs: 5, md: 0 } }}
            >
              <SocialsButton socials={SOCIALS} sx={{ mx: 0.5 }} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container>
              {LINKS.map((list) => (
                <Grid item key={list.headline} xs={6} md={4} padding={2}>
                  <Typography component="p" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      to={link.href}
                      href={link.href}
                      key={link.name}
                      color="inherit"
                      variant="body2"
                      component={link.external ? Link : RouterLink}
                      sx={{ display: 'block' }}
                      rel={link.rel}
                      target={link.target}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
