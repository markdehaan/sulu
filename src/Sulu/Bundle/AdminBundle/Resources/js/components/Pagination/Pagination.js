// @flow
import React, {type Node} from 'react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import Input from '../Input';
import Loader from '../Loader';
import SingleSelect from '../SingleSelect';
import {translate} from '../../utils/Translator';
import paginationStyles from './pagination.scss';

type Props = {
    children: Node,
    currentLimit: number,
    currentPage: ?number,
    loading: boolean,
    onLimitChange: (limit: number) => void,
    onPageChange: (page: number) => void,
    totalPages: ?number,
};

const AVAILABLE_LIMITS = [10, 20, 50, 100];

@observer
class Pagination extends React.Component<Props> {
    @observable currentInputValue = 1;

    static defaultProps = {
        loading: false,
    };

    @action componentDidMount() {
        const {currentPage} = this.props;

        this.currentInputValue = currentPage;
        this.validateAndSubmitInputValue();
    }

    @action componentDidUpdate(prevProps: Props) {
        const {currentPage, totalPages} = this.props;

        if (prevProps.currentPage !== currentPage) {
            this.currentInputValue = currentPage;
            this.validateAndSubmitInputValue();
        }

        if (prevProps.totalPages !== totalPages) {
            this.validateAndSubmitInputValue();
        }
    }

    hasNextPage = () => {
        const {currentPage, totalPages} = this.props;
        if (!currentPage || !totalPages) {
            return false;
        }

        return currentPage < totalPages;
    };

    hasPreviousPage = () => {
        const {currentPage} = this.props;
        if (!currentPage) {
            return false;
        }

        return currentPage > 1;
    };

    handlePreviousClick = () => {
        const {currentPage, onPageChange} = this.props;
        if (!this.hasPreviousPage() || !currentPage) {
            return;
        }

        onPageChange(currentPage - 1);
    };

    handleNextClick = () => {
        const {currentPage, onPageChange} = this.props;
        if (!this.hasNextPage() || !currentPage) {
            return;
        }

        onPageChange(currentPage + 1);
    };

    handleLimitChange = (value: string | number) => {
        const {currentLimit, onLimitChange} = this.props;
        const selected = parseInt(value);

        if (selected !== currentLimit) {
            onLimitChange(selected);
        }
    };

    @action handleInputChange = (value: ?string) => {
        if (value === undefined) {
            this.currentInputValue = undefined;
            return;
        }

        const page = parseInt(value);

        if (!isNaN(page)) {
            this.currentInputValue = page;
        }
    };

    handleInputBlur = () => {
        this.validateAndSubmitInputValue();
    };

    handleInputKeyPress = (key: ?string) => {
        if (key === 'Enter') {
            this.validateAndSubmitInputValue();
        }
    };

    @action validateAndSubmitInputValue = () => {
        const {currentPage, onPageChange, totalPages} = this.props;
        let page = this.currentInputValue;

        if (!page || !totalPages || page < 1) {
            page = 1;
        } else if (page > totalPages) {
            page = totalPages;
        }

        if (page !== currentPage) {
            onPageChange(page);
        }

        this.currentInputValue = currentPage;
    };

    render() {
        const {currentInputValue} = this;
        const {children, loading, totalPages, currentLimit} = this.props;

        return (
            <section className={paginationStyles.resultsContainer}>
                {children}
                <nav className={paginationStyles.pagination}>
                    <span className={paginationStyles.display}>{translate('sulu_admin.per_page')}:</span>
                    <span>
                        <SingleSelect onChange={this.handleLimitChange} skin="dark" value={currentLimit}>
                            {AVAILABLE_LIMITS.map((limit) => (
                                <SingleSelect.Option key={limit} value={limit}>
                                    {limit}
                                </SingleSelect.Option>
                            ))}
                        </SingleSelect>
                    </span>

                    <div className={paginationStyles.loader}>
                        {loading && <Loader size={24} />}
                    </div>
                    <span>
                        {translate('sulu_admin.page')}:
                    </span>
                    <span className={paginationStyles.inputContainer}>
                        <Input
                            alignment="center"
                            inputMode="numeric"
                            onBlur={this.handleInputBlur}
                            onChange={this.handleInputChange}
                            onKeyPress={this.handleInputKeyPress}
                            skin="dark"
                            type="text"
                            value={currentInputValue}
                        />
                    </span>
                    <span className={paginationStyles.display}>
                        {translate('sulu_admin.of')} {totalPages}
                    </span>
                    <ButtonGroup>
                        <Button
                            disabled={!this.hasPreviousPage()}
                            icon="su-angle-left"
                            onClick={this.handlePreviousClick}
                        />
                        <Button
                            disabled={!this.hasNextPage()}
                            icon="su-angle-right"
                            onClick={this.handleNextClick}
                        />
                    </ButtonGroup>
                </nav>
            </section>
        );
    }
}

export default Pagination;
