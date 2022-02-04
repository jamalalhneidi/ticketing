import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

const Header = ({ user }) => {
    const router = useRouter();
    const links = [
        !user && {
            label: 'Sign up',
            href: '/auth/sign-up',
        },
        !user && {
            label: 'Sign in',
            href: '/auth/sign-in',
        },
        user && {
            label: 'My Orders',
            href: '/orders',
            onClick: async (e) => {
                e.preventDefault();
                router.push('/orders');
            },
        },
        user && {
            label: 'Sell Ticket',
            href: '/tickets/create',
            onClick: async (e) => {
                e.preventDefault();
                router.push('/tickets/create');
            },
        },
        user && {
            label: 'Sign out',
            href: '#',
            onClick: async (e) => {
                e.preventDefault();
                await axios.post('/api/users/signout');
                router.push('/');
            },
        },
    ]
        .filter((l) => l)
        .map((link, i) => {
            return (
                <li key={i} className="nav-item">
                    <Link href={link.href}>
                        <a onClick={link.onClick} className="nav-link">
                            {link.label}
                        </a>
                    </Link>
                </li>
            );
        });

    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/">
                <a className="navbar-brand">GitTix</a>
            </Link>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">{links}</ul>
            </div>
        </nav>
    );
};

export default Header;
