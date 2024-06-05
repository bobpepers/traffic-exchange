import React from 'react';
import { connect } from 'react-redux';
import { fetchChainInfo } from '../actions/chainInfoActions';

class ChainInfoList extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchChainInfo());
  }

  render() {
    const { error, loading, chaininfo } = this.props;

    if (error) {
      return (
        <div>
          Error!
          {error.message}
        </div>
      );
    }

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <ul>
        {chaininfo.map((product) => (
          <li key={product.id}>
            {product.blockNumber}
            <br />
            {product.price}
          </li>
        ))}
      </ul>
    );
  }
}

const mapStateToProps = (state) => ({
  chaininfo: state.chaininfo.items,
  loading: state.chaininfo.loading,
  error: state.chaininfo.error,
});

export default connect(mapStateToProps)(ChainInfoList);
