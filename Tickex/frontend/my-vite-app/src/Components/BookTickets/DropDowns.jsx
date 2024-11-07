import React from "react";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from '@ant-design/icons';
import styles from "../Styling/Cinemas.module.css";

export const DropDowns = ({ handleFilters, filters }) => {
    const subRegions = ["Delhi", "Gurgaon", "Greater Noida", "Noida", "Faridabad"];
    
    const menu = (
        <Menu>
            {subRegions.map((region, index) => (
                <Menu.Item key={index + 1}>
                    <div
                        className={styles.filter__item}
                        onClick={() => handleFilters(region)}
                    >
                        <span>{region}</span>
                    </div>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <div className={styles.filter}>
                Filter Sub Regions <DownOutlined />
            </div>
        </Dropdown>
    )
}
