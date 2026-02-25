package com.healthcare.tests;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;

import static org.junit.jupiter.api.Assertions.assertTrue;
public class LoginTest extends BaseTest {

    @Test
    public void testValidLogin() throws InterruptedException {

        driver.get("http://localhost:5173/login");

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("input[type='email']")
        )).sendKeys("user@example.com");
        Thread.sleep(800);
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("input[type='password']")
        )).sendKeys("u@123");
        Thread.sleep(800);
        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(text(),'Login')]")
        )).click();
        Thread.sleep(800);
        wait.until(ExpectedConditions.urlContains("dashboard"));
        Thread.sleep(800);
        assertTrue(driver.getCurrentUrl().contains("dashboard"));
    }
}