function withGuestLayout(WrappedComponent) {
  function WithGuestLayout(props) {
    return <WrappedComponent {...props} />;
  }

  return WithGuestLayout;
}

export default withGuestLayout;
