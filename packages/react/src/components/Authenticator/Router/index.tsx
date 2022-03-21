import { CognitoUserAmplify } from '@aws-amplify/ui';

import { useAuthenticator } from '..';
import { View } from '../../..';
import { ConfirmSignUp } from '../ConfirmSignUp';
import { ForceNewPassword } from '../ForceNewPassword';
import { useCustomComponents } from '../hooks/useCustomComponents';
import { SetupTOTP } from '../SetupTOTP';
import { SignInSignUpTabs } from '../shared';
import { ConfirmVerifyUser, VerifyUser } from '../VerifyUser';
import { ConfirmSignIn } from '../ConfirmSignIn/ConfirmSignIn';
import { ConfirmResetPassword, ResetPassword } from '../ResetPassword';

import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

export type RouterProps = {
  className?: string;
  children?: ({
    signOut,
    user,
  }: {
    signOut: ReturnType<typeof useAuthenticator>['signOut'];
    user: CognitoUserAmplify;
  }) => JSX.Element;
  variation?: 'default' | 'modal';
  hideSignUp?: boolean;
  transitionTimeOut?: number;
};

const hasTabs = (route: string) => {
  return route === 'signIn' || 'signUp';
};

export function Router({
  children,
  className,
  variation = 'default',
  hideSignUp,
  transitionTimeOut,
}: RouterProps) {
  const { route, signOut, user } = useAuthenticator();

  const {
    components: { Header, Footer },
  } = useCustomComponents();

  // Add smooth css transitions between routes
  const routeTransitionRef = useRef<HTMLDivElement>(null);
  const [displayRoute, setDisplayRoute] = useState(route);
  useEffect(() => {
    if (
      (['idle', 'setup', 'authenticated', 'signOut'].includes(displayRoute) &&
        route !== displayRoute) ||
      (displayRoute !== route &&
        ['signIn', 'signUp'].includes(displayRoute) &&
        ['signIn', 'signUp'].includes(route))
    ) {
      setDisplayRoute(route);
    }
  }, [route, displayRoute, setDisplayRoute]);

  // `Authenticator` might not have `children` for non SPA use cases.
  if (['authenticated', 'signOut'].includes(displayRoute)) {
    return children ? children({ signOut, user }) : null;
  }

  return (
    <>
      <View
        className={className}
        data-amplify-authenticator=""
        data-variation={variation}
      >
        <View data-amplify-container="">
          <Header />
          <CSSTransition
            appear
            in={displayRoute === route}
            timeout={transitionTimeOut || 0}
            nodeRef={routeTransitionRef}
            classNames={'route'}
            onExited={() => {
              setDisplayRoute(route);
            }}
          >
            <View
              ref={routeTransitionRef}
              data-amplify-router=""
              data-amplify-router-content={
                hasTabs(displayRoute) ? undefined : ''
              }
            >
              {(() => {
                switch (displayRoute) {
                  case 'idle':
                  case 'setup':
                    return null;
                  case 'confirmSignUp':
                    return <ConfirmSignUp />;
                  case 'confirmSignIn':
                    return <ConfirmSignIn />;
                  case 'setupTOTP':
                    return <SetupTOTP />;
                  case 'signIn':
                  case 'signUp':
                    return (
                      <SignInSignUpTabs
                        hideSignUp={hideSignUp}
                        route={displayRoute}
                      />
                    );
                  case 'forceNewPassword':
                    return <ForceNewPassword />;
                  case 'resetPassword':
                    return <ResetPassword />;
                  case 'confirmResetPassword':
                    return <ConfirmResetPassword />;
                  case 'verifyUser':
                    return <VerifyUser />;
                  case 'confirmVerifyUser':
                    return <ConfirmVerifyUser />;

                  default:
                    console.warn(
                      'Unhandled Authenicator route – please open an issue: ',
                      displayRoute
                    );

                    return null;
                }
              })()}
            </View>
          </CSSTransition>

          <Footer />
        </View>
      </View>
    </>
  );
}
