package com.had.his.DAO;

import com.had.his.Entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TokenDAO extends JpaRepository<Token, Long> {

    @Query("select t.token from Token t where t.username=?1")
    String findByUsername(String username);

    @Query("select t.username from Token t where t.token=?1")
    String findUserByToken(String token);


    @Query("select t.ipaddress from Token t where t.username=?1")
    String findipAdress(String username);

    @Modifying
    @Transactional
    @Query("update Token t set t.ipaddress=?2 where t.username=?1")
    void saveip(String username,String ipaddress);

    @Modifying
    @Transactional
    @Query("delete from Token t where t.ipaddress=?1")
    void deleteip(String ipaddress);

    @Modifying
    @Transactional
    @Query("delete from Token t where t.username=?1")
    void deletetoken(String username);
}


