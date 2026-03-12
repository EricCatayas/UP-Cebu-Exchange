'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type PrevPageLinkProps = { href: string; label: string; classes?: string };

function PrevPageLinkContent({ href, label, classes }: PrevPageLinkProps) {
  const searchParams = useSearchParams();

  const pages: Record<string, { href: string; label: any }> = {
    orders: {
      href: '/admin/orders',
      label: {
        root: 'Orders',
        details: 'Order Details',
      },
    },
    inventory: {
      href: '/admin/inventory',
      label: {
        root: 'Inventory',
        details: 'Artwork Details',
      },
    },
    artists: {
      href: '/admin/artists',
      label: {
        root: 'Artists',
        details: 'Artist Details',
      },
    },
    payments: {
      href: '/admin/payments',
      label: {
        root: 'Payments',
        details: 'Payment Details',
      },
    },
  };

  const prevPage = searchParams.get('prev');
  const id = searchParams.get('id');

  if (prevPage && pages[prevPage]) {
    let { href: pageHref, label } = pages[prevPage];

    let pageLabel = label.root;

    if (id) {
      pageHref += `/${id}`;
      pageLabel = label.details;
    }

    return (
      <Link href={pageHref} className={`text-blue-600 hover:text-blue-800 font-medium ${classes || ''}`}>
        ← Back to {pageLabel}
      </Link>
    );
  }

  return (
    <Link href={href} className={`text-blue-600 hover:text-blue-800 font-medium ${classes || ''}`}>
      ← {label}
    </Link>
  );
}

export default function PrevPageLink(props: PrevPageLinkProps) {
  const { href, label, classes } = props;

  return (
    <Suspense
      fallback={
        <Link href={href} className={`text-blue-600 hover:text-blue-800 font-medium ${classes || ''}`}>
          ← {label}
        </Link>
      }
    >
      <PrevPageLinkContent {...props} />
    </Suspense>
  );
}
